import 'package:flutter/material.dart';
import '../theme/sifra_theme.dart';

class QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String description;
  final VoidCallback? onTap;

  const QuickActionCard({
    super.key,
    required this.icon,
    required this.label,
    required this.description,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: SifraColors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: SifraColors.border),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D352214),
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: const BoxDecoration(
                color: Color(0x1AD4A359),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: SifraColors.gold, size: 28),
            ),
            const SizedBox(height: 12),
            Text(
              label,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: SifraColors.brown,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              description,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: SifraColors.muted),
            ),
          ],
        ),
      ),
    );
  }
}
