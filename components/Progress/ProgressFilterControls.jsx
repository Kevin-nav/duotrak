import React from 'react';
import { Button } from '@/components/ui/button'; // For presets if not using Select/ToggleGroup
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

const dateRangePresets = [
  { value: 'last7d', label: 'Last 7 Days' },
  { value: 'last90d', label: 'Last 90 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  // { value: 'custom', label: 'Custom Range...' } // For later if custom picker is added
];

// Wrap ProgressFilterControls with React.memo
export const ProgressFilterControls = React.memo(({ 
  selectedDateRange, 
  onDateRangeChange, 
  compareWithPartner, 
  onCompareChange,
  partnerUsername, // To display in the compare toggle label
  // selectedSystem, // For future system filter
  // onSystemChange, // For future system filter
  // systemsList,    // For future system filter
  className
}) => {
  // console.log('Rendering ProgressFilterControls'); // For debugging
  return (
    <div className={cn("flex flex-col sm:flex-row sm:flex-wrap items-center gap-[1rem] sm:gap-x-[2rem] sm:gap-y-[2rem]", className)}>
      {/* Date Range Filter */}
      <div className="flex flex-row items-center gap-[1rem]">
        <Label htmlFor="date-range-select" className="text-sm font-medium text-secondary-text-medium whitespace-nowrap">
          Date Range:
        </Label>
        <Select 
          value={selectedDateRange.preset}
          onValueChange={(value) => {
            const selectedPresetObj = dateRangePresets.find(p => p.value === value);
            // Ensure a new object is passed to trigger React.memo update in parent if necessary
            const newSelectedDateRange = selectedPresetObj ? { ...selectedPresetObj } : { ...dateRangePresets[0] }; 
            onDateRangeChange(newSelectedDateRange);
          }}
        >
          <SelectTrigger id="date-range-select" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {dateRangePresets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Partner Comparison Toggle */}
      {partnerUsername && (
        <div className="flex items-center space-x-[1rem]">
          <Switch 
            id="compare-partner-switch"
            checked={compareWithPartner}
            onCheckedChange={onCompareChange}
            aria-label={`Compare with ${partnerUsername}`}
          />
          <Label htmlFor="compare-partner-switch" className="text-sm text-secondary-text-medium cursor-pointer">
            Compare with {partnerUsername}
          </Label>
        </div>
      )}

      {/* System Select Dropdown (Placeholder for Post-MVP) */}
      {/* 
      <div className="flex items-center gap-sm">
        <Label htmlFor="system-select" className="text-sm font-medium text-secondary-text-medium whitespace-nowrap">
          System:
        </Label>
        <Select 
          // value={selectedSystem}
          // onValueChange={onSystemChange}
          disabled // Disabled for MVP
        >
          <SelectTrigger id="system-select" className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Systems" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Systems</SelectItem>
            {systemsList?.map((system) => (
              <SelectItem key={system.id} value={system.id}>
                {system.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> 
      */}
    </div>
  );
});

// Add display name for better debugging
ProgressFilterControls.displayName = 'ProgressFilterControls'; 