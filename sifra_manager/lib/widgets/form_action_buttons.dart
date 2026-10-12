import 'package:flutter/material.dart';
import '../theme/sifra_theme.dart';

class FormActionButtons extends StatelessWidget {
  final String cancelLabel;
  final String primaryLabel;
  final VoidCallback? onCancel;
  final VoidCallback? onPrimary;
  final bool busy;

  const FormActionButtons({
    super.key,
    this.cancelLabel = 'Cancel',
    required this.primaryLabel,
    required this.onCancel,
    required this.onPrimary,
    this.busy = false,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // On very narrow screens, stack vertically
        final stack = constraints.maxWidth < 340;

        final cancel = OutlinedButton(
          onPressed: busy ? null : onCancel,
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
            side: const BorderSide(color: SifraColors.border),
            foregroundColor: SifraColors.muted,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12)),
          ),
          child: Text(cancelLabel),
        );

        final primary = FilledButton(
          onPressed: busy ? null : onPrimary,
          style: FilledButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
          ),
          child: busy
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                      strokeWidth: 2, color: Colors.white),
                )
              : Text(primaryLabel),
        );

        if (stack) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              cancel,
              const SizedBox(height: 10),
              primary,
            ],
          );
        }

        return Row(
          children: [
            Expanded(child: cancel),
            const SizedBox(width: 12),
            Expanded(child: primary),
          ],
        );
      },
    );
  }
}