import 'package:flutter/material.dart';

class BorderButtonWidget extends StatelessWidget {
  final String buttonText;
  final Function onPressed;
  final List<Color> gradientColors;
  final double borderRadius;
  final double height;
  final double fontSize;
  final FontWeight fontWeight;
  final Color textColor;

  const BorderButtonWidget({
    Key? key,
    required this.buttonText,
    required this.onPressed,
    this.gradientColors = const [
      Color(0xFF320D6D),
      Color.fromARGB(255, 109, 64, 207),
      Color.fromARGB(255, 136, 91, 235),
      Color.fromARGB(255, 109, 64, 207),
      Color(0xFF320D6D)
    ],
    this.borderRadius = 8.0,
    this.height = 50.0,
    this.fontSize = 16.0,
    this.fontWeight = FontWeight.bold,
    this.textColor = Colors.white,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () => onPressed(),
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
            border: Border.all(
                color: Color.fromARGB(255, 109, 64, 207),
                width: 2.0,
                strokeAlign: BorderSide.strokeAlignInside,
                style: BorderStyle.solid),
            borderRadius: BorderRadius.circular(borderRadius),
          ),
          child: Container(
            alignment: Alignment.center,
            child: Text(
              buttonText,
              style: TextStyle(
                fontSize: fontSize,
                fontWeight: fontWeight,
                color: textColor,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
