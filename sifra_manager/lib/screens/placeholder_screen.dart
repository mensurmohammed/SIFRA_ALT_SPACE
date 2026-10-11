import 'package:flutter/material.dart';
import '../theme/sifra_theme.dart';

class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.construction_outlined,
              size: 48,
              color: SifraColors.gold,
            ),
            const SizedBox(height: 16),
            Text(title, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text(
              'This section will be ported in a future task.\nThe API endpoint exists on the website already.',
              textAlign: TextAlign.center,
              style: TextStyle(color: SifraColors.muted, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}
