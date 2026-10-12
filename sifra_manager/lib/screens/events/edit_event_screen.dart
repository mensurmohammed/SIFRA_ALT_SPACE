import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/api_client.dart';
import '../../core/events_service.dart';
import '../../models/event.dart';
import '../../theme/sifra_theme.dart';

class EditEventScreen extends StatefulWidget {
  final String eventId;
  const EditEventScreen({super.key, required this.eventId});

  @override
  State<EditEventScreen> createState() => _EditEventScreenState();
}

class _EditEventScreenState extends State<EditEventScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleCtrl = TextEditingController();
  final _dateCtrl = TextEditingController();
  final _startCtrl = TextEditingController();
  final _endCtrl = TextEditingController();
  final _maxCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _descCtrl = TextEditingController();

  DateTime? _date;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  String _status = 'Upcoming';
  bool _hidden = false;

  bool _loading = true;
  bool _saving = false;
  String? _loadError;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _dateCtrl.dispose();
    _startCtrl.dispose();
    _endCtrl.dispose();
    _maxCtrl.dispose();
    _priceCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final e = await EventsService.getById(widget.eventId);
      if (!mounted) return;
      setState(() {
        _titleCtrl.text = e.title;
        _descCtrl.text = e.description ?? '';
        _date = e.eventDate;
        _dateCtrl.text = _fmtDate(e.eventDate);
        _startCtrl.text = e.startTime;
        _startTime = _parseTime(e.startTime);
        _endCtrl.text = e.endTime;
        _endTime = _parseTime(e.endTime);
        _maxCtrl.text = e.maxParticipants.toString();
        _priceCtrl.text = _fmtPrice(e.price);
        _status = e.status;
        _hidden = e.hidden;
        _loading = false;
      });
    } on ApiException catch (err) {
      if (!mounted) return;
      setState(() {
        _loadError = err.message;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loadError = 'Failed to load event';
        _loading = false;
      });
    }
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
    if (_date == null || _startTime == null || _endTime == null) {
      _toast('Please fill in date and both times');
      return;
    }
    setState(() => _saving = true);
    try {
      await EventsService.update(
        id: widget.eventId,
        title: _titleCtrl.text.trim(),
        description: _descCtrl.text.trim(),
        date: _date!,
        startTime: _startCtrl.text,
        endTime: _endCtrl.text,
        maxParticipants: int.tryParse(_maxCtrl.text.trim()) ?? 0,
        price: double.tryParse(_priceCtrl.text.trim()) ?? 0,
        status: _status,
        hidden: _hidden,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Event updated successfully'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
      context.go('/events');
    } on ApiException catch (e) {
      _toast(e.message);
    } catch (_) {
      _toast('Failed to update event');
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
          'Edit Event',
          style: TextStyle(
            fontFamily: Theme.of(context).textTheme.displaySmall?.fontFamily,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(child: _body()),
    );
  }

  Widget _body() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: SifraColors.gold),
      );
    }
    if (_loadError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 48, color: SifraColors.muted),
              const SizedBox(height: 12),
              Text(
                _loadError!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: SifraColors.muted),
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: () {
                  setState(() {
                    _loading = true;
                    _loadError = null;
                  });
                  _load();
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          _label('Event Title *'),
          TextFormField(
            controller: _titleCtrl,
            decoration: const InputDecoration(),
            validator: (v) =>
                (v == null || v.trim().isEmpty) ? 'Title required' : null,
          ),
          const SizedBox(height: 14),

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
            decoration: const InputDecoration(),
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
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Required';
              final n = double.tryParse(v.trim());
              if (n == null) return 'Enter a valid number';
              if (n < 0) return 'Cannot be negative';
              return null;
            },
          ),
          const SizedBox(height: 14),

          _label('Status'),
          DropdownButtonFormField<String>(
            value: _status,
            decoration: const InputDecoration(),
            isExpanded: true,
            items: const [
              DropdownMenuItem(value: 'Upcoming', child: Text('Upcoming')),
              DropdownMenuItem(value: 'Ongoing', child: Text('Ongoing')),
              DropdownMenuItem(value: 'Completed', child: Text('Completed')),
              DropdownMenuItem(value: 'Cancelled', child: Text('Cancelled')),
            ],
            onChanged: (v) => setState(() => _status = v ?? 'Upcoming'),
          ),
          const SizedBox(height: 8),

          CheckboxListTile(
            value: _hidden,
            onChanged: (v) => setState(() => _hidden = v ?? false),
            contentPadding: EdgeInsets.zero,
            activeColor: SifraColors.gold,
            controlAffinity: ListTileControlAffinity.leading,
            title: const Text(
              'Hide Event',
              style: TextStyle(fontSize: 13, color: SifraColors.brown),
            ),
          ),
          const SizedBox(height: 6),

          _label('Description'),
          TextFormField(
            controller: _descCtrl,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'Details about the event program…',
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
                      : const Text('Save Changes'),
                ),
              ),
            ],
          ),
        ],
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

  /// "Jul 23, 2026"
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

  String _fmtTime(TimeOfDay t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  String _fmtPrice(double v) {
    if (v == v.roundToDouble()) return v.toInt().toString();
    return v.toStringAsFixed(2);
  }

  /// "18:00" → TimeOfDay(18, 0); returns null on malformed input
  TimeOfDay? _parseTime(String s) {
    final m = RegExp(r'^(\d{1,2}):(\d{2})').firstMatch(s);
    if (m == null) return null;
    final h = int.tryParse(m.group(1)!);
    final min = int.tryParse(m.group(2)!);
    if (h == null || min == null) return null;
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return TimeOfDay(hour: h, minute: min);
  }
}
