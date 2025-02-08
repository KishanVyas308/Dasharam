import 'package:dasaram_app/components/buttons/border_button.dart';
import 'package:dasaram_app/components/buttons/gradient_button.dart';
import 'package:dasaram_app/components/scafold_message.dart';
import 'package:dasaram_app/utils/notification_services.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:dasaram_app/pages/home_page.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:url_launcher/url_launcher_string.dart';
import 'package:hive/hive.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  NotificationServices notificationServices = NotificationServices();
  @override
  void initState() {
    super.initState();
    notificationServices.requwstNotificationPermission();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Color.fromARGB(255, 22, 11, 66),
    ));
  }

  static final backendUrl =
      'https://dasharam-git-main-kishan-vyas-projects.vercel.app/api/v1/free';

  final TextEditingController grNoController = TextEditingController();
  bool isLoading = false;

  Future<void> _launchPhoneDialer(String phoneNumber) async {
    final Uri launchUri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrlString(launchUri.toString())) {
      await launchUrlString(launchUri.toString());
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not launch $phoneNumber')),
      );
    }
  }

  Future<void> login() async {
    final grNo = grNoController.text;

    if (grNo.isEmpty) {
      ScaffoldMessage.show(context, message: 'Please enter your Gr No');
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('$backendUrl/auth/login-student'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'grno': grNo}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['data'];

        ScaffoldMessage.show(context,
            message: "Hello ${data['name']}", backgroundColor: Colors.green);

        // Store data in Hive
        var box = await Hive.openBox('userBox');
        await box.put('user', {
          'studentId': data['id'],
          'grno': data['grno'],
          'standardId': data['standardId'],
          'role': data['role'],
          'parentName': data['parentName'],
          'parentMobileNo': data['parentMobileNo'],
          'name': data['name'],
        });

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => MainPage(
              name: data['name'],
              grNo: data['grno'],
              studentId: data['id'],
              stdId: data['standardId'],
              subjects: [],
              tests: [],
            ),
          ),
        );
      } else {
        ScaffoldMessage.show(
          context,
          message: 'Student not found',
        );
      }
    } catch (e) {
      ScaffoldMessage.show(
        context,
        message: 'An error occurred. Please try again later.',
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color.fromARGB(255, 22, 11, 66),
                Color.fromARGB(255, 1, 0, 9)
              ],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Center(
            child: isLoading
                ? CircularProgressIndicator()
                : SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Add a logo at the top
                        Image.asset(
                          'assets/dasharam_logo.png',
                          height: 100,
                        ),
                        SizedBox(height: 24.0),
                        Text(
                          'Dasaram',
                          style: TextStyle(
                            fontSize: 36.0,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            fontFamily: 'Pacifico',
                          ),
                        ),
                        SizedBox(height: 16.0),
                        Text(
                          'Enter your Gr No',
                          style: TextStyle(
                            fontSize: 18.0,
                            color: Colors.white70,
                            fontFamily: 'Pacifico',
                          ),
                        ),
                        SizedBox(height: 26.0),
                        TextField(
                          controller: grNoController,
                          style: TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.1),
                            labelText: 'Gr No',
                            labelStyle: TextStyle(color: Colors.white),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                              borderRadius: BorderRadius.circular(8.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                              borderRadius: BorderRadius.circular(8.0),
                            ),
                          ),
                        ),
                        SizedBox(height: 16.0),
                        GradientButtonWidget(
                          text: 'Login',
                          onPressed: login,
                        ),
                        SizedBox(height: 16.0),
                        Text(
                          'OR',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16.0,
                          ),
                        ),
                        SizedBox(height: 16.0),
                        BorderButtonWidget(
                          buttonText: 'Call Us',
                          onPressed: () async {
                            final Uri url = Uri(
                              scheme: 'tel',
                              path: '+916356689500',
                            );
                            if (await canLaunchUrl(url)) {
                              await launchUrl(url);
                            }
                          },
                        ),
                        SizedBox(height: 24.0),
                        // Add some footer text
                        Text(
                          'Need help? Contact our support team.',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 14.0,
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}
