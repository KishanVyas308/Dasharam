import 'package:flutter/material.dart';

class ScaffoldMessage extends StatelessWidget {
  final String message;
  final Color backgroundColor;
  final TextStyle textStyle;
  final SnackBarBehavior behavior;

  const ScaffoldMessage({
    super.key,
    required this.message,
    this.backgroundColor = Colors.red,
    this.textStyle = const TextStyle(color: Colors.white),
    this.behavior = SnackBarBehavior.floating,
  });

  @override
  Widget build(BuildContext context) {
    return Container();
  }

  static void show(
    BuildContext context, {
    required String message,
    Color backgroundColor = Colors.red,
    TextStyle textStyle = const TextStyle(color: Colors.white),
    SnackBarBehavior behavior = SnackBarBehavior.floating,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: textStyle,
        ),
        backgroundColor: backgroundColor,
        behavior: behavior,
      ),
    );
  }
}
