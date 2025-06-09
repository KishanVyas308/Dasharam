import 'package:flutter/material.dart';
import 'package:dasaram_app/pages/home_page.dart';

class MainNavigationPage extends StatefulWidget {
  final String name;
  final String grNo;
  final String stdId;
  final String studentId;
  final List<dynamic> subjects;
  final List<dynamic> tests;

  const MainNavigationPage({
    super.key,
    required this.name,
    required this.grNo,
    required this.stdId,
    required this.subjects,
    required this.tests,
    required this.studentId,
  });

  @override
  _MainNavigationPageState createState() => _MainNavigationPageState();
}

class _MainNavigationPageState extends State<MainNavigationPage> {
  @override
  Widget build(BuildContext context) {
    return MainPage(
      name: widget.name,
      grNo: widget.grNo,
      stdId: widget.stdId,
      studentId: widget.studentId,
      subjects: List<dynamic>.from(widget.subjects),
      tests: List<dynamic>.from(widget.tests),
    );
  }
}
