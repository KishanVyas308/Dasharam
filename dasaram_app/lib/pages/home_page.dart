import 'dart:ui';

import 'package:dasaram_app/utils/notification_services.dart';
import 'package:flutter/material.dart';
import 'package:dasaram_app/pages/login.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:hive/hive.dart';
import 'package:url_launcher/url_launcher.dart';

class MainPage extends StatefulWidget {
  final String name;
  final String grNo;
  final String stdId;
  final String studentId;
  List<dynamic> subjects;
  List<dynamic> tests;

  MainPage({
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

class _MainPageState extends State<MainPage>
    with SingleTickerProviderStateMixin {
  NotificationServices notificationServices = NotificationServices();

  @override
  void initState() {
    super.initState();
    notificationServices.requwstNotificationPermission();
    notificationServices.firebaseInit();
    notificationServices.isTokenRefresh();
    notificationServices.getDeviceToken().then(
      (token) {
        print('Device Token: $token');
        _sendTokenAndStandardId(
            token.toString(), widget.stdId); // Send token and standard ID
      },
    );
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Color.fromARGB(255, 22, 11, 66),
    ));
    _loadData(); // Load data from Hive
    _fetchData(); // Fetch data on page start
    _initAnimation();
  }

  static final backendUrl =
      'https://dasharam-git-main-kishan-vyas-projects.vercel.app/api/v1/free';
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
    newSubjectsMap =
        Map<String, bool>.from(box.get('newSubjectsMap', defaultValue: {}));
    newTestsMap =
        Map<String, bool>.from(box.get('newTestsMap', defaultValue: {}));
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
        final subjects = jsonDecode(cachedSubjectResponse)['subjects'];
        final tests = jsonDecode(cachedTestData);

        // Sort tests by uploaded date, new to old
        tests.sort((a, b) => DateTime.parse(b['takenDate'])
            .compareTo(DateTime.parse(a['takenDate'])));

        setState(() {
          widget.subjects = subjects;
          widget.tests = tests;
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
        newTests.sort((a, b) => DateTime.parse(b['takenDate'])
            .compareTo(DateTime.parse(a['takenDate'])));

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
          widget.subjects = newSubjects;
          widget.tests = newTests;
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
        final subjects = jsonDecode(subjectResponse.body)['subjects'];
        final tests = jsonDecode(testData.body);

        // Sort tests by uploaded date, new to old
        tests.sort((a, b) => DateTime.parse(b['takenDate'])
            .compareTo(DateTime.parse(a['takenDate'])));

        setState(() {
          widget.subjects = subjects;
          widget.tests = tests;
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
        widget.tests.where((test) => test['subject'] == subjectName).toList();
    if (subjectTests.isEmpty) return 0.0;

    double totalMarks = 0.0;
    double obtainedMarks = 0.0;
    for (var test in subjectTests) {
      totalMarks += double.parse(test['totalMarks']);
      final student = test['students'].firstWhere(
          (student) => student['studentId'] == widget.studentId,
          orElse: () => {'marks': '0'});

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
    widget.tests
        .where((test) => test['subject'] == subjectName)
        .forEach((test) => newTestsMap.remove(test['id']));
    Hive.box('dataBox').put('newTestsMap', newTestsMap);
    Hive.box('dataBox').put('newSubjectsMap', newSubjectsMap);
  }

  void _initAnimation() {
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();
    _animation = Tween<double>(begin: 0, end: 1).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(
            'Dasaram',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          backgroundColor: Color.fromARGB(255, 18, 32, 47),
          actions: [
            IconButton(
              icon: Icon(Icons.logout),
              onPressed: () async => await _logout(context),
              style: ButtonStyle(
                foregroundColor: MaterialStateProperty.all(Colors.white),
              ),
            ),
          ],
        ),
        body: isLoading
            ? Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(
                    Colors.white,
                  ),
                ),
              )
            : Container(
                decoration:
                    BoxDecoration(color: Color.fromARGB(255, 28, 40, 51)),
                padding: const EdgeInsets.all(16.0),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Hello, ${widget.name}',
                              style: TextStyle(
                                  fontSize: 24,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontFamily: 'Roboto')),
                          Text('Gr No: ${widget.grNo}',
                              style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white70,
                                  fontFamily: 'Roboto')),
                          Text(
                              'Standard: ${widget.subjects.isEmpty ? 'Loading...' : standard}',
                              style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white70,
                                  fontFamily: 'Roboto')),
                        ],
                      ),
                      SizedBox(height: 20),
                      Text('Subjects',
                          style: TextStyle(
                              fontSize: 21,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              fontFamily: 'Roboto')),
                      Expanded(
                        child: ListView.builder(
                          itemCount: widget.subjects.length,
                          itemBuilder: (context, index) {
                            final subject = widget.subjects[index];
                            final subjectPercentage =
                                _calculateSubjectPercentage(subject['name']);
                            final percentageColor = subjectPercentage < 35
                                ? Colors.red
                                : subjectPercentage < 60
                                    ? Colors.yellow
                                    : Colors.green;
                            return AnimatedBuilder(
                              animation: _animation,
                              builder: (context, child) {
                                return Card(
                                  color: newSubjectsMap
                                          .containsKey(subject['name'])
                                      ? Colors.deepPurple
                                      : Color.fromARGB(255, 36, 49, 60),
                                  elevation: 1,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                    side: BorderSide(
                                      color: newSubjectsMap
                                              .containsKey(subject['name'])
                                          ? Colors.white
                                              .withOpacity(_animation.value)
                                          : Color.fromARGB(255, 18, 32, 47),
                                      width: 1.5,
                                    ),
                                  ),
                                  margin: EdgeInsets.symmetric(vertical: 8.0),
                                  child: Stack(
                                    children: [
                                      ListTile(
                                        contentPadding: EdgeInsets.symmetric(
                                            horizontal: 16.0, vertical: 0.0),
                                        title: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              subject['name'],
                                              style: TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                              ),
                                            ),
                                            Text(
                                              '${subjectPercentage.toStringAsFixed(2)}%',
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                                color: percentageColor,
                                              ),
                                            ),
                                          ],
                                        ),
                                        shape: RoundedRectangleBorder(
                                          side: BorderSide(
                                              color: Color.fromARGB(
                                                  255, 18, 32, 47),
                                              width: 1),
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        onTap: () {
                                          final subjectTests = widget.tests
                                              .where((test) =>
                                                  test['subject'] ==
                                                  subject['name'])
                                              .toList();
                                          showModalBottomSheet(
                                            context: context,
                                            backgroundColor:
                                                Color.fromARGB(255, 28, 40, 51),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.vertical(
                                                      top: Radius.circular(
                                                          25.0)),
                                            ),
                                            builder: (context) => Padding(
                                              padding:
                                                  const EdgeInsets.all(16.0),
                                              child: ListView.builder(
                                                itemCount: subjectTests.length,
                                                itemBuilder:
                                                    (context, testIndex) {
                                                  final test =
                                                      subjectTests[testIndex];
                                                  final student = test[
                                                          'students']
                                                      .firstWhere(
                                                          (student) =>
                                                              student[
                                                                  'studentId'] ==
                                                              widget.studentId,
                                                          orElse: () => {
                                                                'marks': '0',
                                                              });
                                                  final percentage = ((int.parse(
                                                                  student[
                                                                      'marks']) /
                                                              int.parse(test[
                                                                  'totalMarks'])) *
                                                          100)
                                                      .toStringAsFixed(2);
                                                  final percentageColor = double
                                                              .parse(
                                                                  percentage) <
                                                          35
                                                      ? Colors.red
                                                      : double.parse(
                                                                  percentage) <
                                                              60
                                                          ? Colors.yellow
                                                          : Colors.green;
                                                  return Card(
                                                    color: newTestsMap
                                                            .containsKey(
                                                                test['id'])
                                                        ? Colors.deepPurple
                                                        : Color.fromARGB(
                                                            255, 36, 49, 60),
                                                    elevation: 2,
                                                    shape:
                                                        RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              10),
                                                    ),
                                                    margin:
                                                        EdgeInsets.symmetric(
                                                            vertical: 8.0),
                                                    child: ListTile(
                                                      contentPadding:
                                                          EdgeInsets.symmetric(
                                                              horizontal: 16.0,
                                                              vertical: 8.0),
                                                      title: Row(
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .spaceBetween,
                                                        children: [
                                                          Text(
                                                            'Test: ${test['name']}',
                                                            style: TextStyle(
                                                              fontSize: 16,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                              color:
                                                                  Colors.white,
                                                            ),
                                                          ),
                                                          Text(
                                                            '$percentage%',
                                                            style: TextStyle(
                                                              fontSize: 16,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .bold,
                                                              color:
                                                                  percentageColor,
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                      subtitle: Column(
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .start,
                                                        children: [
                                                          Text(
                                                            'Total Marks: ${test['totalMarks']}',
                                                            style: TextStyle(
                                                              fontSize: 14,
                                                              color: Colors
                                                                  .white70,
                                                            ),
                                                          ),
                                                          Text(
                                                            'Marks: ${(test['students'].firstWhere((student) => student['studentId'] == widget.studentId, orElse: () => {
                                                                  'marks': '0'
                                                                }))['marks']}',
                                                            style: TextStyle(
                                                              fontSize: 14,
                                                              color: Colors
                                                                  .white70,
                                                            ),
                                                          ),
                                                          Text(
                                                            'Date: ${(test['takenDate']).toString().substring(0, 10).split('-').reversed.join('-')}',
                                                            style: TextStyle(
                                                              fontSize: 14,
                                                              color: Colors
                                                                  .white70,
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                  );
                                                },
                                              ),
                                            ),
                                          ).whenComplete(() {
                                            setState(() {
                                              _removeSubjectAndTests(
                                                  subject['name']);
                                              _checkAllNewTests();
                                            });
                                          });
                                        },
                                      ),
                                    ],
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      ),
                      SizedBox(height: 20),
                      Center(
                        child: GestureDetector(
                          onTap: () {
                            showModalBottomSheet(
                              context: context,
                              backgroundColor: Color.fromARGB(255, 28, 40, 51),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.vertical(
                                  top: Radius.circular(25.0),
                                ),
                              ),
                              builder: (context) => Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'Developers',
                                      style: TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                    SizedBox(height: 10),
                                    ListTile(
                                      leading: CircleAvatar(
                                        backgroundImage: NetworkImage(
                                          'https://ugc.production.linktr.ee/da71d0eb-b447-4e93-8b94-1448d508ff37_WhatsApp-Image-2024-08-26-at-18.40.49-b4376253.jpeg?io=true&size=avatar-v3_0',
                                        ),
                                      ),
                                      title: Text(
                                        'Kishan Vyas',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                      subtitle: Text(
                                        'App & Web Developer',
                                        style: TextStyle(
                                          color: Colors.white70,
                                        ),
                                      ),
                                      trailing: ElevatedButton(
                                        onPressed: () {
                                          launch(
                                              'https://linktr.ee/kishanvyas');
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.blue,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                        ),
                                        child: Text(
                                          'Show detail',
                                          style: TextStyle(
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ),
                                    ListTile(
                                      leading: CircleAvatar(
                                        backgroundImage: NetworkImage(
                                          'https://ugc.production.linktr.ee/8edd7bde-06ea-405a-ac57-f5b6819dd577_1000124112.jpeg?io=true&size=avatar-v3_0',
                                        ),
                                      ),
                                      title: Text(
                                        'Nit Sanghani',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                      subtitle: Text(
                                        'Web Developer',
                                        style: TextStyle(
                                          color: Colors.white70,
                                        ),
                                      ),
                                      trailing: ElevatedButton(
                                        onPressed: () {
                                          launch('https://linktr.ee/Nit_Patel');
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.blue,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                        ),
                                        child: Text(
                                          'Show detail',
                                          style: TextStyle(
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                          child: Text(
                            'Developed by',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white70,
                              fontWeight: FontWeight.bold,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ),
                    ]),
              ));
  }
}
