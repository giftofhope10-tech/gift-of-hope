interface StatCardProps {
  value: string | number;
  label: string;
  color: string;
}

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: '800', 
        color, 
        marginBottom: '4px' 
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '0.9rem', 
        color: '#6B7280', 
        fontWeight: '500' 
      }}>
        {label}
      </div>
    </div>
  );
}
