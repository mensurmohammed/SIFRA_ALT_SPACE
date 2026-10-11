import 'package:flutter/material.dart';
import '../theme/sifra_theme.dart';

class StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color accentColor;
  final Color accentBg;
  final bool danger;

  const StatCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    required this.accentColor,
    required this.accentBg,
    this.danger = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border(
          top: const BorderSide(color: SifraColors.border),
          right: const BorderSide(color: SifraColors.border),
          bottom: const BorderSide(color: SifraColors.border),
          left: BorderSide(
            color: danger ? SifraColors.danger : SifraColors.border,
            width: danger ? 4 : 1,
          ),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D352214),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: accentBg, shape: BoxShape.circle),
            child: Icon(icon, color: accentColor, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            label.toUpperCase(),
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.8,
              color: SifraColors.muted,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: danger ? SifraColors.danger : SifraColors.brown,
            ),
          ),
        ],
      ),
    );
  }
}
