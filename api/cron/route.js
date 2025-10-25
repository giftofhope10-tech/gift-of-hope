export default function handler(req, res) {
  console.log('Cron job ran successfully!');
  res.status(200).json({ ok: true });
}
