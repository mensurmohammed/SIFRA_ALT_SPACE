import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/events_service.dart';
import '../../theme/sifra_theme.dart';

class CreateEventScreen extends StatefulWidget {
  const CreateEventScreen({super.key});

  @override
  State<CreateEventScreen> createState() => _CreateEventScreenState();
}

class _CreateEventScreenState extends State<CreateEventScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleCtrl = TextEditingController();
  final _dateCtrl = TextEditingController();
  final _startCtrl = TextEditingController();
  final _endCtrl = TextEditingController();
  final _maxCtrl = TextEditingController(text: '0');
  final _priceCtrl = TextEditingController(text: '0');
  final _descCtrl = TextEditingController();
  final _coverCtrl = TextEditingController();

  DateTime? _date;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;

  bool _saving = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _dateCtrl.dispose();
    _startCtrl.dispose();
    _endCtrl.dispose();
    _maxCtrl.dispose();
    _priceCtrl.dispose();
    _descCtrl.dispose();
    _coverCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(
            primary: SifraColors.brown,
            onPrimary: Colors.white,
            onSurface: SifraColors.brown,
          ),
        ),
        child: child!,
      ),
    );
    if (picked == null) return;
    setState(() {
      _date = picked;
      _dateCtrl.text = _fmtDate(picked);
    });
  }

  Future<void> _pickTime({required bool isStart}) async {
    final initial = isStart
        ? (_startTime ?? const TimeOfDay(hour: 18, minute: 0))
        : (_endTime ?? const TimeOfDay(hour: 19, minute: 0));
    final picked = await showTimePicker(
      context: context,
      initialTime: initial,
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(
            primary: SifraColors.brown,
            onPrimary: Colors.white,
            onSurface: SifraColors.brown,
          ),
        ),
        child: child!,
      ),
    );
    if (picked == null) return;
    setState(() {
      if (isStart) {
        _startTime = picked;
        _startCtrl.text = _fmtTime(picked);
      } else {
        _endTime = picked;
        _endCtrl.text = _fmtTime(picked);
      }
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_date == null) {
      _toast('Please select a date');
      return;
    }
    if (_startTime == null) {
      _toast('Please select a start time');
      return;
    }
    if (_endTime == null) {
      _toast('Please select an end time');
      return;
    }
    setState(() => _saving = true);
    try {
      await EventsService.create(
        title: _titleCtrl.text.trim(),
        description: _descCtrl.text.trim(),
        date: _date!,
        startTime: _startCtrl.text,
        endTime: _endCtrl.text,
        maxParticipants: int.tryParse(_maxCtrl.text.trim()) ?? 0,
        price: double.tryParse(_priceCtrl.text.trim()) ?? 0,
        cover: _coverCtrl.text.trim(),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Event created successfully'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/events');
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to create event');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _toast(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: SifraColors.danger,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: SifraColors.cream,
      appBar: AppBar(
        backgroundColor: SifraColors.brown,
        foregroundColor: Colors.white,
        title: Text(
          'Create Event',
          style: TextStyle(
            fontFamily: Theme.of(context).textTheme.displaySmall?.fontFamily,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
            children: [
              _label('Event Title *'),
              TextFormField(
                controller: _titleCtrl,
                decoration: const InputDecoration(
                  hintText: 'e.g. Ethiopian Coffee Ceremony & Poetry Reading',
                ),
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Title required' : null,
              ),
              const SizedBox(height: 20),

              // ---- Cover image (B1 pattern — URL paste only) ----
              _coverSection(),
              const SizedBox(height: 20),

              // ---- Date + Time row ----
              _label('Date *'),
              InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(12),
                child: IgnorePointer(
                  child: TextFormField(
                    controller: _dateCtrl,
                    decoration: const InputDecoration(
                      hintText: 'mm/dd/yyyy',
                      suffixIcon: Icon(Icons.event, color: SifraColors.gold),
                    ),
                    validator: (v) => (_date == null) ? 'Pick a date' : null,
                  ),
                ),
              ),
              const SizedBox(height: 14),

              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _label('Start Time *'),
                        InkWell(
                          onTap: () => _pickTime(isStart: true),
                          borderRadius: BorderRadius.circular(12),
                          child: IgnorePointer(
                            child: TextFormField(
                              controller: _startCtrl,
                              decoration: const InputDecoration(
                                hintText: '--:--',
                                suffixIcon: Icon(
                                  Icons.access_time,
                                  color: SifraColors.gold,
                                  size: 18,
                                ),
                              ),
                              validator: (v) =>
                                  (_startTime == null) ? 'Required' : null,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _label('End Time *'),
                        InkWell(
                          onTap: () => _pickTime(isStart: false),
                          borderRadius: BorderRadius.circular(12),
                          child: IgnorePointer(
                            child: TextFormField(
                              controller: _endCtrl,
                              decoration: const InputDecoration(
                                hintText: '--:--',
                                suffixIcon: Icon(
                                  Icons.access_time,
                                  color: SifraColors.gold,
                                  size: 18,
                                ),
                              ),
                              validator: (v) =>
                                  (_endTime == null) ? 'Required' : null,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              _label('Maximum Participants (0 for unlimited)'),
              TextFormField(
                controller: _maxCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(hintText: '0'),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return null;
                  final n = int.tryParse(v.trim());
                  if (n == null) return 'Whole number required';
                  if (n < 0) return 'Cannot be negative';
                  return null;
                },
              ),
              const SizedBox(height: 14),

              _label('Event Price (ETB, 0 for free)'),
              TextFormField(
                controller: _priceCtrl,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: const InputDecoration(hintText: '0'),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Required';
                  final n = double.tryParse(v.trim());
                  if (n == null) return 'Enter a valid number';
                  if (n < 0) return 'Cannot be negative';
                  return null;
                },
              ),
              const SizedBox(height: 14),

              _label('Description'),
              TextFormField(
                controller: _descCtrl,
                maxLines: 4,
                decoration: const InputDecoration(
                  hintText:
                      'Details about the event program, featured speakers or activities…',
                ),
              ),
              const SizedBox(height: 24),

              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _saving ? null : () => context.go('/events'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(color: SifraColors.border),
                        foregroundColor: SifraColors.muted,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton(
                      onPressed: _saving ? null : _submit,
                      child: _saving
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Text('Save Event'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _label(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 6),
    child: Text(
      text,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        fontSize: 13,
        color: SifraColors.brown,
      ),
    ),
  );

  Widget _coverSection() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: SifraColors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: SifraColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Event Cover Image (1:1 Square)',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 13,
              color: SifraColors.brown,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: SifraColors.cream,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: SifraColors.border),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline, size: 16, color: SifraColors.gold),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'On Android, file picker is not supported in this build. '
                    'Paste a cover image URL below.',
                    style: TextStyle(fontSize: 11, color: SifraColors.muted),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Cover Image URL',
            style: TextStyle(fontSize: 12, color: SifraColors.muted),
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: _coverCtrl,
            keyboardType: TextInputType.url,
            decoration: const InputDecoration(
              hintText: 'https://images.example.com/cover.jpg',
            ),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return null;
              final u = v.trim();
              if (!u.startsWith('http://') && !u.startsWith('https://')) {
                return 'Must start with http:// or https://';
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  /// "Jul 23, 2026" — same format as event card
  String _fmtDate(DateTime d) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return '${months[d.month - 1]} ${d.day}, ${d.year}';
  }

  /// "18:00" — 24-hour HH:mm (matches the website's <input type="time">)
  String _fmtTime(TimeOfDay t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
}
