import { BLOOD_COMPATIBILITY, BLOOD_TYPES, type BloodType } from '@/types';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const BloodCompatibilityChart = ({ highlightType }: { highlightType?: BloodType }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left text-muted-foreground font-medium text-xs">Recipient →</th>
            {BLOOD_TYPES.map(bt => (
              <th key={bt} className={`p-2 text-center font-bold text-xs ${highlightType === bt ? 'text-primary' : 'text-foreground'}`}>
                {bt}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BLOOD_TYPES.map((donor, i) => (
            <motion.tr
              key={donor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border-t border-border/50 ${highlightType === donor ? 'bg-primary/5' : ''}`}
            >
              <td className={`p-2 font-bold text-xs ${highlightType === donor ? 'text-primary' : 'text-foreground'}`}>
                {donor}
              </td>
              {BLOOD_TYPES.map(recipient => {
                const compatible = BLOOD_COMPATIBILITY[recipient]?.includes(donor);
                return (
                  <td key={recipient} className="p-2 text-center">
                    {compatible ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/10">
                        <Check className="h-3 w-3 text-success" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                        <X className="h-3 w-3 text-muted-foreground/40" />
                      </span>
                    )}
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BloodCompatibilityChart;
