import 'package:flutter/material.dart';

class GradientButtonWidget extends StatelessWidget {
  final VoidCallback onPressed;
  final String text;
  final List<Color> gradientColors;
  final double height;
  final double borderRadius;

  const GradientButtonWidget({
    Key? key,
    required this.onPressed,
    required this.text,
    this.gradientColors = const [
      Color(0xFF320D6D),
      Color.fromARGB(255, 109, 64, 207),
      Color.fromARGB(255, 136, 91, 235),
      Color.fromARGB(255, 109, 64, 207),
      Color(0xFF320D6D)
    ],
    this.height = 50.0,
    this.borderRadius = 8.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          padding: EdgeInsets.all(0.0),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
        ),
        child: Ink(
          width: double.infinity,
          height: height,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: gradientColors,
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          child: Container(
            alignment: Alignment.center,
            child: Text(
              text,
              style: TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
