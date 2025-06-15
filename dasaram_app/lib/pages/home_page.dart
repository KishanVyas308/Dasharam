import 'dart:ui';
import 'dart:math' as math;

import 'package:dasaram_app/utils/notification_services.dart';
import 'package:flutter/material.dart';
import 'package:dasaram_app/pages/login.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:hive/hive.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:percent_indicator/percent_indicator.dart';
import 'package:animated_bottom_navigation_bar/animated_bottom_navigation_bar.dart';

class MainPage extends StatefulWidget {
  final String name;
  final String grNo;
  final String stdId;
  final String studentId;
  final List<dynamic> subjects;
  final List<dynamic> tests;

  const MainPage({
    super.key,
    required this.name,
    required this.grNo,
    required this.stdId,
    required this.subjects,
    required this.tests,
    required this.studentId,
  });

  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> with TickerProviderStateMixin {
  int _selectedIndex = 0;
  NotificationServices notificationServices = NotificationServices();

  // Local state variables for subjects and tests
  List<dynamic> subjects = [];
  List<dynamic> tests = [];

  // Animation controllers
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late AnimationController _scaleController;
  late AnimationController _floatingController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<double> _floatingAnimation;

  void _onItemTapped(int index) {
    HapticFeedback.lightImpact();
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    // Initialize with widget data
    subjects = List<dynamic>.from(widget.subjects);
    tests = List<dynamic>.from(widget.tests);

    notificationServices.requwstNotificationPermission();
    notificationServices.firebaseInit();
    notificationServices.isTokenRefresh();
    notificationServices.getDeviceToken().then((token) {
      print('Device Token: $token');
      _sendTokenAndStandardId(
        token.toString(),
        widget.stdId,
      ); // Send token and standard ID
    });
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
      ),
    );
    _loadData(); // Load data from Hive
    _fetchData(); // Fetch data on page start
    _initModernAnimations();
  }

  static final backendUrl = 'https://dasharam.onrender.com/api/v1/free';
  bool isLoading = false;

  Future<void> _sendTokenAndStandardId(String token, String stdId) async {
    final url = '$backendUrl/notfy/check-add-token';

    try {
      setState(() {
        isLoading = true;
      });
      await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'token': token, 'standardId': stdId}),
      );
    } catch (e) {
      print('Error sending token and standard ID: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _loadData() async {
    var box = await Hive.openBox('dataBox');
    newSubjectsMap = Map<String, bool>.from(
      box.get('newSubjectsMap', defaultValue: {}),
    );
    newTestsMap = Map<String, bool>.from(
      box.get('newTestsMap', defaultValue: {}),
    );
  }

  String standard = '';
  Map<String, bool> newTestsMap = {};
  Map<String, bool> newSubjectsMap = {};
  late AnimationController _controller;
  late Animation<double> _animation;
  Future<void> _fetchData() async {
    setState(() {
      isLoading = true;
    });

    try {
      var box = await Hive.openBox('dataBox');
      var cachedSubjectResponse = box.get('subjectResponse');
      var cachedTestData = box.get('testData');

      if (cachedSubjectResponse != null && cachedTestData != null) {
        standard = jsonDecode(cachedSubjectResponse)['standard'];
        final fetchedSubjects = jsonDecode(cachedSubjectResponse)['subjects'];
        final fetchedTests = jsonDecode(cachedTestData);

        // Sort tests by uploaded date, new to old
        fetchedTests.sort(
          (a, b) => DateTime.parse(
            b['takenDate'],
          ).compareTo(DateTime.parse(a['takenDate'])),
        );

        setState(() {
          subjects = fetchedSubjects;
          tests = fetchedTests;
        });

        // Fetch new data if internet is on
        final subjectResponse = await http.get(
          Uri.parse('$backendUrl/subject-standard/${widget.stdId}'),
        );

        final testData = await http.get(
          Uri.parse('$backendUrl/test/standard/${widget.stdId}'),
        );

        final newSubjects = jsonDecode(subjectResponse.body)['subjects'];
        final newTests = jsonDecode(testData.body);

        // Sort new tests by uploaded date, new to old
        newTests.sort(
          (a, b) => DateTime.parse(
            b['takenDate'],
          ).compareTo(DateTime.parse(a['takenDate'])),
        );

        // Compare old and new data
        if (newTests.length != tests.length) {
          for (var newTest in newTests) {
            if (!tests.any((test) => test['id'] == newTest['id'])) {
              newTestsMap[newTest['id']] = true;
              newSubjectsMap[newTest['subject']] = true;
            }
          }
        }

        setState(() {
          subjects = newSubjects;
          tests = newTests;
        });

        await box.put('subjectResponse', subjectResponse.body);
        await box.put('testData', testData.body);
        await box.put('newSubjectsMap', newSubjectsMap);
        await box.put('newTestsMap', newTestsMap);
      } else {
        final subjectResponse = await http.get(
          Uri.parse('$backendUrl/subject-standard/${widget.stdId}'),
        );

        final testData = await http.get(
          Uri.parse('$backendUrl/test/standard/${widget.stdId}'),
        );

        standard = jsonDecode(subjectResponse.body)['standard'];
        final fetchedSubjects = jsonDecode(subjectResponse.body)['subjects'];
        final fetchedTests = jsonDecode(testData.body);

        // Sort tests by uploaded date, new to old
        fetchedTests.sort(
          (a, b) => DateTime.parse(
            b['takenDate'],
          ).compareTo(DateTime.parse(a['takenDate'])),
        );

        setState(() {
          subjects = fetchedSubjects;
          tests = fetchedTests;
        });

        await box.put('subjectResponse', subjectResponse.body);
        await box.put('testData', testData.body);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred while fetching data.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _logout(BuildContext context) async {
    var box = await Hive.openBox('userBox');
    await box.clear();
    final url = '$backendUrl/notfy/remove-token';
    final token = await notificationServices.getDeviceToken();
    try {
      setState(() {
        isLoading = true;
      });
      await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'standardId': widget.stdId, 'token': token}),
      );
      setState(() {
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => LoginPage()),
    );
  }

  double _calculateSubjectPercentage(String subjectName) {
    final subjectTests =
        tests.where((test) => test['subject'] == subjectName).toList();
    if (subjectTests.isEmpty) return 0.0;

    double totalMarks = 0.0;
    double obtainedMarks = 0.0;
    for (var test in subjectTests) {
      totalMarks += double.parse(test['totalMarks']);
      final student = test['students'].firstWhere(
        (student) => student['studentId'] == widget.studentId,
        orElse: () => {'marks': '0'},
      );

      obtainedMarks += double.parse(student['marks']);
    }

    return (obtainedMarks / totalMarks) * 100;
  }

  void _checkAllNewTests() {
    if (newTestsMap.isEmpty) {
      newSubjectsMap.clear();
    }
  }

  void _removeSubjectAndTests(String subjectName) {
    newSubjectsMap.remove(subjectName);
    tests
        .where((test) => test['subject'] == subjectName)
        .forEach((test) => newTestsMap.remove(test['id']));
    Hive.box('dataBox').put('newTestsMap', newTestsMap);
    Hive.box('dataBox').put('newSubjectsMap', newSubjectsMap);
  }

  void _initModernAnimations() {
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _floatingController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _slideController, curve: Curves.easeOutQuart),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );

    _floatingAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _floatingController, curve: Curves.easeInOut),
    );

    // Start animations with staggered delays
    _fadeController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      _slideController.forward();
    });
    Future.delayed(const Duration(milliseconds: 600), () {
      _scaleController.forward();
    });
    _floatingController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _scaleController.dispose();
    _floatingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final List<Widget> _pages = [
      _buildHomePage(context),
      _buildChartsPage(context),
      _buildSettingsPage(context),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFF0A0E27),
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Dasaram',
          style: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: -0.5,
          ),
        ),
        actions: [
          if (_selectedIndex == 2)
            Container(
              margin: const EdgeInsets.only(right: 16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: IconButton(
                icon: const Icon(Icons.logout_rounded),
                onPressed: () async => await _logout(context),
                style: ButtonStyle(
                  foregroundColor: WidgetStateProperty.all(Colors.white),
                ),
              ),
            ),
        ],
      ),
      body: Stack(
        children: [
          // Modern gradient background
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF0A0E27),
                  Color(0xFF1A1F3A),
                  Color(0xFF2D3561),
                  Color(0xFF1A1F3A),
                  Color(0xFF0A0E27),
                ],
                stops: [0.0, 0.25, 0.5, 0.75, 1.0],
              ),
            ),
          ),

          // Animated floating elements
          ...List.generate(5, (index) {
            return AnimatedBuilder(
              animation: _floatingAnimation,
              builder: (context, child) {
                return Positioned(
                  top: (index % 3) * size.height * 0.3 +
                      (20 * _floatingAnimation.value) +
                      (index * 60),
                  left: (index % 2) * size.width * 0.8 +
                      (15 * _floatingAnimation.value) +
                      (index * 40),
                  child: Opacity(
                    opacity: 0.1,
                    child: Container(
                      width: 80 + (index * 15),
                      height: 80 + (index * 15),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            const Color(0xFF6366F1).withOpacity(0.3),
                            const Color(0xFF8B5CF6).withOpacity(0.1),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            );
          }),

          // Main content
          SafeArea(
            child: isLoading
                ? _buildModernLoadingScreen()
                : _pages[_selectedIndex],
          ),
        ],
      ),
      bottomNavigationBar: _buildModernBottomNav(),
    );
  }

  Widget _buildModernLoadingScreen() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF6366F1).withOpacity(0.2),
                  const Color(0xFF8B5CF6).withOpacity(0.1),
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withOpacity(0.3),
                  blurRadius: 30,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 80,
                  height: 80,
                  child: CircularProgressIndicator(
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      Color(0xFF6366F1),
                    ),
                    strokeWidth: 3,
                    backgroundColor: Colors.white.withOpacity(0.1),
                  ),
                ),
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFF6366F1).withOpacity(0.2),
                  ),
                  child: const Icon(
                    Icons.school_rounded,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
          Text(
            'Loading Dashboard...',
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Fetching your academic data',
            style: GoogleFonts.inter(
              color: Colors.white.withOpacity(0.7),
              fontSize: 16,
              fontWeight: FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModernBottomNav() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1A1F3A), Color(0xFF0A0E27)],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: ClipRRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: AnimatedBottomNavigationBar(
            icons: const [
              Icons.home_rounded,
              Icons.bar_chart_rounded,
              Icons.settings_rounded,
            ],
            activeIndex: _selectedIndex,
            onTap: _onItemTapped,
            backgroundColor: Colors.transparent,
            activeColor: const Color(0xFF6366F1),
            inactiveColor: Colors.white.withOpacity(0.6),
            iconSize: 24,
            gapLocation: GapLocation.none,
            notchSmoothness: NotchSmoothness.softEdge,
            leftCornerRadius: 0,
            rightCornerRadius: 0,
            splashColor: const Color(0xFF6366F1).withOpacity(0.3),
            splashSpeedInMilliseconds: 300,
          ),
        ),
      ),
    );
  }

  Widget _buildHomePage(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Header
            SlideTransition(
              position: _slideAnimation,
              child: _buildWelcomeHeader(),
            ),
            const SizedBox(height: 30),

            // Quick Stats Cards
            ScaleTransition(
              scale: _scaleAnimation,
              child: _buildQuickStatsCards(),
            ),
            const SizedBox(height: 30),

            // Performance Overview
            FadeTransition(
              opacity: _fadeAnimation,
              child: _buildPerformanceOverview(),
            ),
            const SizedBox(height: 30),

            // Subjects Grid
            SlideTransition(
              position: _slideAnimation,
              child: _buildSubjectsGrid(),
            ),
            const SizedBox(height: 30),

            // Developers Section
            _buildDevelopersSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            const Color(0xFF6366F1).withOpacity(0.1),
            const Color(0xFF8B5CF6).withOpacity(0.05),
          ],
        ),
        border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.person_rounded,
                  color: Colors.white,
                  size: 30,
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hello, ${widget.name}',
                      style: GoogleFonts.inter(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'GR No: ${widget.grNo}',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.7),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      'Standard: ${subjects.isEmpty ? 'Loading...' : standard}',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.7),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickStatsCards() {
    final totalSubjects = subjects.length;
    final totalTests = tests.length;
    final averagePercentage = _calculateOverallPercentage();

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Subjects',
            totalSubjects.toString(),
            Icons.book_rounded,
            const Color(0xFF6366F1),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Tests',
            totalTests.toString(),
            Icons.quiz_rounded,
            const Color(0xFF8B5CF6),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Average',
            '${averagePercentage.toStringAsFixed(1)}%',
            Icons.trending_up_rounded,
            const Color(0xFF10B981),
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: Colors.white.withOpacity(0.7),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerformanceOverview() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.analytics_rounded,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 16),
              Text(
                'Performance Overview',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          CircularPercentIndicator(
            radius: 60.0,
            lineWidth: 8.0,
            percent: _calculateOverallPercentage() / 100,
            center: Text(
              '${_calculateOverallPercentage().toStringAsFixed(1)}%',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
            progressColor: const Color(0xFF6366F1),
            backgroundColor: Colors.white.withOpacity(0.1),
            circularStrokeCap: CircularStrokeCap.round,
          ),
        ],
      ),
    );
  }

  Widget _buildSubjectsGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Subjects',
          style: GoogleFonts.inter(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 16),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: subjects.length,
          itemBuilder: (context, index) {
            final subject = subjects[index];
            final subjectPercentage = _calculateSubjectPercentage(
              subject['name'],
            );
            final percentageColor = _getPerformanceColor(subjectPercentage);

            return AnimatedBuilder(
              animation: _floatingAnimation,
              builder: (context, child) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    color: newSubjectsMap.containsKey(subject['name'])
                        ? const Color(0xFF6366F1).withOpacity(0.2)
                        : Colors.white.withOpacity(0.05),
                    border: Border.all(
                      color: newSubjectsMap.containsKey(subject['name'])
                          ? Color.lerp(
                              const Color(0xFF6366F1),
                              Colors.white,
                              _floatingAnimation.value,
                            )!
                          : Colors.white.withOpacity(0.1),
                      width: 1.5,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(20),
                        leading: Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                percentageColor,
                                percentageColor.withOpacity(0.7),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.subject_rounded,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                        title: Text(
                          subject['name'],
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        subtitle: LinearPercentIndicator(
                          width: 150,
                          lineHeight: 6.0,
                          percent: subjectPercentage / 100,
                          backgroundColor: Colors.white.withOpacity(0.2),
                          progressColor: percentageColor,
                          barRadius: const Radius.circular(3),
                        ),
                        trailing: Text(
                          '${subjectPercentage.toStringAsFixed(1)}%',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: percentageColor,
                          ),
                        ),
                        onTap: () => _showSubjectDetails(subject),
                      ),
                    ),
                  ),
                );
              },
            );
          },
        ),
      ],
    );
  }

  /// Builds a styled developers section with team information and interactive button
  /// Enhanced developers section with modern glassmorphism design
  Widget _buildDevelopersSection() {
    const sectionPadding = EdgeInsets.all(24);
    const buttonPadding = EdgeInsets.symmetric(horizontal: 24, vertical: 14);
    const borderRadius = 20.0;
    const buttonRadius = 16.0;

    return Container(
      padding: sectionPadding,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.08),
            Colors.white.withOpacity(0.02),
          ],
        ),
        border: Border.all(
          color: Colors.white.withOpacity(0.15),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: const Color(0xFF6366F1).withOpacity(0.05),
            blurRadius: 30,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header with icon
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF6366F1).withOpacity(0.2),
                      const Color(0xFF8B5CF6).withOpacity(0.2),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.engineering_rounded,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Crafted with ❤️ by',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.white.withOpacity(0.9),
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildViewTeamButton(buttonPadding, buttonRadius),
        ],
      ),
    );
  }

  /// Enhanced "View Team" button with modern styling and hover effects
  Widget _buildViewTeamButton(EdgeInsets padding, double radius) {
    return GestureDetector(
      onTap: _showDevelopersModal,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: padding,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(0xFF6366F1).withOpacity(0.8),
              const Color(0xFF8B5CF6).withOpacity(0.6),
              const Color(0xFFEC4899).withOpacity(0.4),
            ],
            stops: const [0.0, 0.5, 1.0],
          ),
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(
            color: Colors.white.withOpacity(0.2),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF6366F1).withOpacity(0.3),
              blurRadius: 15,
              offset: const Offset(0, 6),
            ),
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(radius),
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.white.withOpacity(0.1),
                Colors.transparent,
              ],
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.groups_rounded,
                  color: Colors.white,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Meet Our Team',
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  letterSpacing: 0.3,
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.arrow_forward_ios_rounded,
                color: Colors.white.withOpacity(0.8),
                size: 14,
              ),
            ],
          ),
        ),
      ),
    );
  }

  double _calculateOverallPercentage() {
    if (tests.isEmpty) return 0.0;

    double totalMarks = 0.0;
    double obtainedMarks = 0.0;

    for (var test in tests) {
      totalMarks += double.parse(test['totalMarks']);
      final student = test['students'].firstWhere(
        (student) => student['studentId'] == widget.studentId,
        orElse: () => {'marks': '0'},
      );
      obtainedMarks += double.parse(student['marks']);
    }

    return totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0.0;
  }

  Color _getPerformanceColor(double percentage) {
    if (percentage >= 80) return const Color(0xFF10B981);
    if (percentage >= 60) return const Color(0xFFF59E0B);
    if (percentage >= 35) return const Color(0xFFEF4444);
    return const Color(0xFFDC2626);
  }

  void _showSubjectDetails(dynamic subject) {
    final subjectTests =
        tests.where((test) => test['subject'] == subject['name']).toList();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.8,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A1F3A), Color(0xFF0A0E27)],
          ),
          borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(25),
          ),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Handle bar
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Header
                  Row(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.subject_rounded,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              subject['name'],
                              style: GoogleFonts.inter(
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                                letterSpacing: -0.5,
                              ),
                            ),
                            Text(
                              '${subjectTests.length} Tests Available',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.7),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Tests list
                  Expanded(
                    child: ListView.builder(
                      itemCount: subjectTests.length,
                      itemBuilder: (context, testIndex) {
                        final test = subjectTests[testIndex];
                        final student = test['students'].firstWhere(
                          (student) => student['studentId'] == widget.studentId,
                          orElse: () => {'marks': '0'},
                        );
                        final percentage = ((int.parse(student['marks']) /
                                    int.parse(test['totalMarks'])) *
                                100)
                            .toStringAsFixed(1);
                        final percentageColor = _getPerformanceColor(
                          double.parse(percentage),
                        );

                        return Container(
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: newTestsMap.containsKey(test['id'])
                                ? const Color(
                                    0xFF6366F1,
                                  ).withOpacity(0.2)
                                : Colors.white.withOpacity(0.05),
                            border: Border.all(
                              color: Colors.white.withOpacity(0.1),
                            ),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        test['name'],
                                        style: GoogleFonts.inter(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: percentageColor.withOpacity(
                                          0.2,
                                        ),
                                        borderRadius: BorderRadius.circular(
                                          8,
                                        ),
                                      ),
                                      child: Text(
                                        '$percentage%',
                                        style: GoogleFonts.inter(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: percentageColor,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    _buildTestDetailItem(
                                      'Marks',
                                      '${student['marks']}/${test['totalMarks']}',
                                      Icons.grade_rounded,
                                    ),
                                    const SizedBox(width: 20),
                                    _buildTestDetailItem(
                                      'Date',
                                      test['takenDate']
                                          .toString()
                                          .substring(0, 10)
                                          .split('-')
                                          .reversed
                                          .join('-'),
                                      Icons.calendar_today_rounded,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    ).whenComplete(() {
      setState(() {
        _removeSubjectAndTests(subject['name']);
        _checkAllNewTests();
      });
    });
  }

  Widget _buildTestDetailItem(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: Colors.white.withOpacity(0.7), size: 16),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: Colors.white.withOpacity(0.7),
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 14,
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _showDevelopersModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A1F3A), Color(0xFF0A0E27)],
          ),
          borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(25),
          ),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Handle bar
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 20),

                  Text(
                    'Development Team',
                    style: GoogleFonts.inter(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 20),

                  _buildDeveloperCard(
                    'Kishan Vyas',
                    'Web & App Developer',
                    'https://ugc.production.linktr.ee/da71d0eb-b447-4e93-8b94-1448d508ff37_WhatsApp-Image-2024-08-26-at-18.40.49-b4376253.jpeg?io=true&size=avatar-v3_0',
                    'https://kishanvyas.tech',
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDeveloperCard(
    String name,
    String role,
    String imageUrl,
    String linkUrl,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          CircleAvatar(radius: 30, backgroundImage: NetworkImage(imageUrl)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                Text(
                  role,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.7),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              onPressed: () {
                HapticFeedback.lightImpact();
                launch(linkUrl);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'View Profile',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChartsPage(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            SlideTransition(
              position: _slideAnimation,
              child: _buildChartsHeader(),
            ),
            const SizedBox(height: 30),

            // Performance Chart
            ScaleTransition(
              scale: _scaleAnimation,
              child: _buildPerformanceChart(),
            ),
            const SizedBox(height: 30),

            // Subject Comparison Chart
            FadeTransition(
              opacity: _fadeAnimation,
              child: _buildSubjectComparisonChart(),
            ),
            const SizedBox(height: 30),

            // Progress Timeline
            SlideTransition(
              position: _slideAnimation,
              child: _buildProgressTimeline(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChartsHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            const Color(0xFF6366F1).withOpacity(0.1),
            const Color(0xFF8B5CF6).withOpacity(0.05),
          ],
        ),
        border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.analytics_rounded,
              color: Colors.white,
              size: 30,
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Analytics Dashboard',
                  style: GoogleFonts.inter(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                Text(
                  'Track your academic progress',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.7),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerformanceChart() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Overall Performance',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 20,
                  getDrawingHorizontalLine: (value) {
                    return FlLine(
                      color: Colors.white.withOpacity(0.1),
                      strokeWidth: 1,
                    );
                  },
                ),
                titlesData: FlTitlesData(
                  show: true,
                  rightTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 30,
                      interval: 1,
                      getTitlesWidget: (double value, TitleMeta meta) {
                        const style = TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                          fontSize: 12,
                        );
                        Widget text;
                        switch (value.toInt()) {
                          case 0:
                            text = const Text('Test 1', style: style);
                            break;
                          case 1:
                            text = const Text('Test 2', style: style);
                            break;
                          case 2:
                            text = const Text('Test 3', style: style);
                            break;
                          case 3:
                            text = const Text('Test 4', style: style);
                            break;
                          case 4:
                            text = const Text('Test 5', style: style);
                            break;
                          default:
                            text = const Text('', style: style);
                            break;
                        }
                        return SideTitleWidget(
                          axisSide: meta.axisSide,
                          child: text,
                        );
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      interval: 20,
                      getTitlesWidget: (double value, TitleMeta meta) {
                        return Text(
                          '${value.toInt()}%',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                            fontSize: 12,
                          ),
                        );
                      },
                      reservedSize: 42,
                    ),
                  ),
                ),
                borderData: FlBorderData(
                  show: true,
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                minX: 0,
                maxX: 4,
                minY: 0,
                maxY: 100,
                lineBarsData: [
                  LineChartBarData(
                    spots: _getPerformanceSpots(),
                    isCurved: true,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                    ),
                    barWidth: 3,
                    isStrokeCapRound: true,
                    dotData: FlDotData(
                      show: true,
                      getDotPainter: (spot, percent, barData, index) {
                        return FlDotCirclePainter(
                          radius: 4,
                          color: Colors.white,
                          strokeWidth: 2,
                          strokeColor: const Color(0xFF6366F1),
                        );
                      },
                    ),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF6366F1).withOpacity(0.3),
                          const Color(0xFF8B5CF6).withOpacity(0.1),
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubjectComparisonChart() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Subject Performance',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: 100,
                barTouchData: BarTouchData(enabled: false),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (double value, TitleMeta meta) {
                        if (value.toInt() < subjects.length) {
                          return Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              subjects[value.toInt()]['name']
                                          .toString()
                                          .length >
                                      8
                                  ? '${subjects[value.toInt()]['name'].toString().substring(0, 8)}...'
                                  : subjects[value.toInt()]['name'].toString(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                                fontSize: 10,
                              ),
                            ),
                          );
                        }
                        return const Text('');
                      },
                      reservedSize: 30,
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 40,
                      interval: 20,
                      getTitlesWidget: (double value, TitleMeta meta) {
                        return Text(
                          '${value.toInt()}%',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                            fontSize: 12,
                          ),
                        );
                      },
                    ),
                  ),
                  topTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(show: false),
                barGroups: _getSubjectBarGroups(),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 20,
                  getDrawingHorizontalLine: (value) {
                    return FlLine(
                      color: Colors.white.withOpacity(0.1),
                      strokeWidth: 1,
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressTimeline() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Progress',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          ...tests.take(5).map((test) => _buildTimelineItem(test)).toList(),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(dynamic test) {
    final student = test['students'].firstWhere(
      (student) => student['studentId'] == widget.studentId,
      orElse: () => {'marks': '0'},
    );
    final percentage =
        ((int.parse(student['marks']) / int.parse(test['totalMarks'])) * 100);
    final color = _getPerformanceColor(percentage);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  test['name'],
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                Text(
                  '${test['subject']} • ${percentage.toStringAsFixed(1)}%',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.7),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Text(
            test['takenDate']
                .toString()
                .substring(0, 10)
                .split('-')
                .reversed
                .join('-'),
            style: GoogleFonts.inter(
              fontSize: 12,
              color: Colors.white.withOpacity(0.5),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  List<FlSpot> _getPerformanceSpots() {
    if (tests.isEmpty) return [const FlSpot(0, 0)];

    final recentTests = tests.take(5).toList();
    List<FlSpot> spots = [];

    for (int i = 0; i < recentTests.length; i++) {
      final test = recentTests[i];
      final student = test['students'].firstWhere(
        (student) => student['studentId'] == widget.studentId,
        orElse: () => {'marks': '0'},
      );
      final percentage =
          (int.parse(student['marks']) / int.parse(test['totalMarks'])) * 100;
      spots.add(FlSpot(i.toDouble(), percentage));
    }

    return spots;
  }

  List<BarChartGroupData> _getSubjectBarGroups() {
    List<BarChartGroupData> groups = [];

    for (int i = 0; i < subjects.length; i++) {
      final subject = subjects[i];
      final percentage = _calculateSubjectPercentage(subject['name']);
      final color = _getPerformanceColor(percentage);

      groups.add(
        BarChartGroupData(
          x: i,
          barRods: [
            BarChartRodData(
              toY: percentage,
              gradient: LinearGradient(
                colors: [color, color.withOpacity(0.7)],
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
              ),
              width: 20,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(4),
              ),
            ),
          ],
        ),
      );
    }

    return groups;
  }

  Widget _buildSettingsPage(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            SlideTransition(
              position: _slideAnimation,
              child: _buildSettingsHeader(),
            ),
            const SizedBox(height: 30),

            // Profile Section
            ScaleTransition(
              scale: _scaleAnimation,
              child: _buildProfileSection(),
            ),
            const SizedBox(height: 30),

            // App Settings
            FadeTransition(opacity: _fadeAnimation, child: _buildAppSettings()),
            const SizedBox(height: 30),

            // Account Actions
            SlideTransition(
              position: _slideAnimation,
              child: _buildAccountActions(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            const Color(0xFF6366F1).withOpacity(0.1),
            const Color(0xFF8B5CF6).withOpacity(0.05),
          ],
        ),
        border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.settings_rounded,
              color: Colors.white,
              size: 30,
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Settings',
                  style: GoogleFonts.inter(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                Text(
                  'Manage your account and preferences',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.white.withOpacity(0.7),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Profile Information',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          _buildProfileItem('Name', widget.name, Icons.person_rounded),
          const SizedBox(height: 16),
          _buildProfileItem('GR Number', widget.grNo, Icons.badge_rounded),
          const SizedBox(height: 16),
          _buildProfileItem(
            'Standard',
            subjects.isEmpty ? 'Loading...' : standard,
            Icons.school_rounded,
          ),
          const SizedBox(height: 16),
          _buildProfileItem(
            'Student ID',
            widget.studentId,
            Icons.fingerprint_rounded,
          ),
        ],
      ),
    );
  }

  Widget _buildProfileItem(String label, String value, IconData icon) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withOpacity(0.2),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: const Color(0xFF6366F1), size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.white.withOpacity(0.7),
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                value,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAppSettings() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'App Preferences',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          _buildSettingItem(
            'Notifications',
            'Receive updates about new tests',
            Icons.notifications_rounded,
            true,
            (value) {
              // Handle notification toggle
            },
          ),
          const SizedBox(height: 16),
          _buildSettingItem(
            'Dark Mode',
            'Always enabled for better experience',
            Icons.dark_mode_rounded,
            true,
            null, // Disabled toggle
          ),
          const SizedBox(height: 16),
          _buildSettingItem(
            'Auto Refresh',
            'Automatically fetch new data',
            Icons.refresh_rounded,
            true,
            (value) {
              // Handle auto refresh toggle
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSettingItem(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    Function(bool)? onChanged,
  ) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withOpacity(0.2),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: const Color(0xFF6366F1), size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                subtitle,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.white.withOpacity(0.7),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: onChanged,
          activeColor: const Color(0xFF6366F1),
          inactiveThumbColor: Colors.white.withOpacity(0.5),
          inactiveTrackColor: Colors.white.withOpacity(0.2),
        ),
      ],
    );
  }

  Widget _buildAccountActions() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Account Actions',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          _buildActionButton(
            'Refresh Data',
            'Sync latest information',
            Icons.sync_rounded,
            const Color(0xFF10B981),
            () {
              HapticFeedback.lightImpact();
              _fetchData();
            },
          ),
          const SizedBox(height: 16),
          _buildActionButton(
            'Clear Cache',
            'Free up storage space',
            Icons.cleaning_services_rounded,
            const Color(0xFFF59E0B),
            () async {
              HapticFeedback.lightImpact();
              var box = await Hive.openBox('dataBox');
              await box.clear();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Cache cleared successfully'),
                  backgroundColor: const Color(0xFFF59E0B),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          _buildActionButton(
            'Logout',
            'Sign out of your account',
            Icons.logout_rounded,
            const Color(0xFFEF4444),
            () async {
              HapticFeedback.lightImpact();
              await _logout(context);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: color.withOpacity(0.1),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.7),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded, color: color, size: 16),
          ],
        ),
      ),
    );
  }
}
