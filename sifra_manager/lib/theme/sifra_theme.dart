import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SifraColors {
  static const cream = Color(0xFFF7F4EE);
  static const brown = Color(0xFF352214);
  static const gold = Color(0xFFD4A359);
  static const danger = Color(0xFFC65911);
  static const muted = Color(0xFF706F6F);
  static const border = Color(0xFFE5DFD3);
  static const white = Color(0xFFFFFFFF);
}

class SifraTheme {
  static ThemeData light() {
    final base = ThemeData.light(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: SifraColors.cream,
      colorScheme: base.colorScheme.copyWith(
        primary: SifraColors.brown,
        secondary: SifraColors.gold,
        surface: SifraColors.white,
        error: SifraColors.danger,
      ),
      textTheme: GoogleFonts.interTextTheme(base.textTheme).copyWith(
        // Serif display for headers — matches the website's font-serif
        displaySmall: GoogleFonts.playfairDisplay(
          fontSize: 26,
          fontWeight: FontWeight.w700,
          color: SifraColors.brown,
        ),
        headlineSmall: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: SifraColors.brown,
        ),
        titleMedium: GoogleFonts.playfairDisplay(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: SifraColors.brown,
        ),
        bodyMedium: GoogleFonts.inter(fontSize: 14, color: SifraColors.brown),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: SifraColors.brown,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: SifraColors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: SifraColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: SifraColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: SifraColors.gold, width: 1.5),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: SifraColors.brown,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
        ),
      ),
    );
  }
}
