const express = require('express');
const router = express.Router();
const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const HOSPITAL_DATA = {
  name: 'MediCare Hospital',
  departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'ENT', 'Dermatology', 'Gynecology', 'Psychiatry', 'Emergency'],
  doctors: [
    // { name, specialization, department, fee, availability }
    // Populate from your actual hospital DB — do NOT hardcode public figures.
  ],
};

function findRelevantDoctors(userText) {
  const text = userText.toLowerCase();
  return HOSPITAL_DATA.doctors.filter(d =>
    text.includes(d.specialization.toLowerCase()) ||
    text.includes(d.department.toLowerCase()) ||
    text.includes(d.name.toLowerCase())
  );
}

const SYSTEM_PROMPT = `You are MediBot, an expert AI medical assistant for ${HOSPITAL_DATA.name}.

You specialize in:
1. Hospital Operations — scheduling, appointments, ward/bed availability, department routing
2. Doctor Information — use ONLY the doctor data provided in context; never invent names, fees, or availability
3. Health Advice — for ANY disease, condition, or body system the user asks about (covering the full A-Z range of illnesses and human anatomy), explain: what it is, common symptoms, general causes, when to see a doctor, and basic self-care/prevention. Draw on your own general medical knowledge — you are not limited to a fixed list.
4. Medical Terminology — explain any medical term in plain language, for any body system (cardiovascular, respiratory, nervous, digestive, musculoskeletal, endocrine, etc.)
5. Emergency Guidance — recognize red-flag symptoms and say "Call emergency services immediately"

Rules:
- Be professional, empathetic, clear
- Never diagnose — general information only, always suggest seeing a real doctor for anything serious
- Max 200 words, bullet points for lists
- Only state doctor names/fees/departments that appear in the "Available hospital data" section below — if none are given, say you don't have that specific record and offer to check with the front desk
- Respond in the same language the user writes in`;

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const relevantDoctors = findRelevantDoctors(lastUserMsg);

    const contextBlock = relevantDoctors.length
      ? `Available hospital data:\n${relevantDoctors.map(d =>
          `- Dr. ${d.name} (${d.specialization}, ${d.department}) — Fee: ${d.fee}, Availability: ${d.availability}`
        ).join('\n')}`
      : `Available hospital data:\nDepartments: ${HOSPITAL_DATA.departments.join(', ')}\n(No specific doctor record matched this query.)`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'system', content: contextBlock },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;
    if (!reply) return res.status(500).json({ error: 'No response from AI' });

    res.json({ reply });
  } catch (err) {
    console.error('Groq API error:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'AI service error. Please try again.';
    res.status(status).json({ error: message });
  }
});

module.exports = router;