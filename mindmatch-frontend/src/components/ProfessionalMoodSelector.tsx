/**
 * @fileoverview Professional Mood Selector Component
 * @description Provides a user-friendly mood tracking interface without emoji dependencies
 * @author MindMate Development Team
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';

//#region Type Definitions

/**
 * Mood scale configuration
 * Defines the visual and textual representation of mood levels
 */
interface IMoodScale {
  /** Numerical value of the mood (1-10) */
  value: number;
  /** Text label for the mood level */
  label: string;
  /** Color associated with the mood level */
  color: string;
  /** Brief description of the mood */
  description: string;
}

/**
 * Props for the Professional Mood Selector component
 */
interface IProfessionalMoodSelectorProps {
  /** Current mood score value */
  value: number;
  /** Callback function when mood value changes */
  onChange: (value: number) => void;
  /** Optional CSS class name */
  className?: string;
}

//#endregion Type Definitions

//#region Constants

/**
 * Mood scale configuration array
 * Maps numerical values to descriptive labels and colors
 */
const MOOD_SCALE: IMoodScale[] = [
  { value: 1, label: 'Very Low', color: '#ef4444', description: 'Feeling very down or distressed' },
  { value: 2, label: 'Low', color: '#f97316', description: 'Feeling somewhat down' },
  { value: 3, label: 'Below Average', color: '#eab308', description: 'Feeling below normal' },
  { value: 4, label: 'Slightly Low', color: '#84cc16', description: 'Feeling slightly off' },
  { value: 5, label: 'Neutral', color: '#22c55e', description: 'Feeling balanced and stable' },
  { value: 6, label: 'Slightly High', color: '#16a34a', description: 'Feeling slightly positive' },
  { value: 7, label: 'Good', color: '#059669', description: 'Feeling good and optimistic' },
  { value: 8, label: 'Very Good', color: '#0d9488', description: 'Feeling very positive' },
  { value: 9, label: 'Excellent', color: '#0891b2', description: 'Feeling excellent and energetic' },
  { value: 10, label: 'Outstanding', color: '#6366f1', description: 'Feeling absolutely amazing' },
];

/**
 * Common emotion suggestions for quick selection
 */
const EMOTION_SUGGESTIONS: string[] = [
  'Happy', 'Sad', 'Anxious', 'Excited', 'Calm', 'Frustrated',
  'Content', 'Overwhelmed', 'Grateful', 'Worried', 'Confident', 'Peaceful',
  'Energetic', 'Tired', 'Hopeful', 'Lonely', 'Proud', 'Stressed'
];

//#endregion Constants

/**
 * Professional Mood Selector Component
 * 
 * Provides an intuitive, accessible mood tracking interface with:
 * - Visual color-coded mood indicators
 * - Descriptive labels and tooltips
 * - Smooth animations and transitions
 * - Mobile-responsive design
 * - Professional styling without emoji dependencies
 * 
 * @param props - Component properties
 * @returns Rendered mood selector component
 */
export const ProfessionalMoodSelector: React.FC<IProfessionalMoodSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {

  //#region State Variables

  /**
   * Whether the mood tooltip is currently visible
   */
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  //#endregion State Variables

  //#region Event Handlers

  /**
   * Handles mood slider value changes
   * 
   * @param event - Input change event
   */
  const handleMoodChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  }, [onChange]);

  /**
   * Shows the mood description tooltip
   */
  const handleMouseEnter = useCallback((): void => {
    setShowTooltip(true);
  }, []);

  /**
   * Hides the mood description tooltip
   */
  const handleMouseLeave = useCallback((): void => {
    setShowTooltip(false);
  }, []);

  //#endregion Event Handlers

  //#region Utility Methods

  /**
   * Gets the current mood configuration based on the selected value
   * 
   * @returns Current mood scale configuration
   */
  const getCurrentMood = useCallback((): IMoodScale => {
    return MOOD_SCALE.find(mood => mood.value === value) || MOOD_SCALE[4];
  }, [value]);

  /**
   * Generates the gradient background for the slider
   * 
   * @returns CSS gradient string
   */
  const getSliderGradient = useCallback((): string => {
    const colors = MOOD_SCALE.map(mood => mood.color);
    return `linear-gradient(90deg, ${colors.join(', ')})`;
  }, []);

  //#endregion Utility Methods

  const currentMood = getCurrentMood();

  return (
    <div className={`professional-mood-selector ${className}`}>
      <label 
        htmlFor="mood-slider" 
        style={{ 
          fontWeight: 600, 
          marginBottom: '8px', 
          display: 'block',
          color: '#374151'
        }}
      >
        How is your mood today?
      </label>
      
      <fieldset 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '8px',
          position: 'relative',
          border: 'none',
          padding: 0,
          margin: 0
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Low mood indicator */}
        <div 
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          1
        </div>

        {/* Mood slider */}
        <input
          id="mood-slider"
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={handleMoodChange}
          style={{
            flex: 1,
            height: '8px',
            borderRadius: '4px',
            background: getSliderGradient(),
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        />

        {/* High mood indicator */}
        <div 
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          10
        </div>

        {/* Current mood value */}
        <div 
          style={{
            minWidth: '32px',
            height: '32px',
            borderRadius: '50%',
            background: currentMood.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          {value}
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div 
            style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1f2937',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10
            }}
          >
            <div>{currentMood.label}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              {currentMood.description}
            </div>
            {/* Tooltip arrow */}
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #1f2937'
              }}
            />
          </div>
        )}
      </fieldset>

      {/* Mood scale labels */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '11px', 
          color: '#6b7280',
          marginTop: '4px',
          paddingLeft: '24px',
          paddingRight: '24px'
        }}
      >
        <span>Very Low</span>
        <span>Neutral</span>
        <span>Outstanding</span>
      </div>

      {/* Current mood display */}
      <div 
        style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: `${currentMood.color}10`,
          border: `1px solid ${currentMood.color}30`,
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <div 
          style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: currentMood.color,
            marginBottom: '2px'
          }}
        >
          {currentMood.label}
        </div>
        <div 
          style={{ 
            fontSize: '12px', 
            color: '#6b7280'
          }}
        >
          {currentMood.description}
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Emotion Input Component
 * 
 * Provides emotion input with suggestions and quick-select options
 * 
 * @param props - Component properties
 * @returns Rendered emotion input component
 */
interface IEnhancedEmotionInputProps {
  /** Current emotion value */
  value: string;
  /** Callback when emotion changes */
  onChange: (emotion: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional CSS class name */
  className?: string;
}

export const EnhancedEmotionInput: React.FC<IEnhancedEmotionInputProps> = ({
  value,
  onChange,
  placeholder = "Describe your emotion...",
  className = ''
}) => {

  //#region State Variables

  /**
   * Whether the suggestions dropdown is visible
   */
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  /**
   * Filtered emotion suggestions based on current input
   */
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(EMOTION_SUGGESTIONS);

  //#endregion State Variables

  //#region Event Handlers

  /**
   * Handles emotion input changes
   * 
   * @param event - Input change event
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    onChange(inputValue);

    // Filter suggestions based on input
    const filtered = EMOTION_SUGGESTIONS.filter(emotion =>
      emotion.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(inputValue.length > 0 && filtered.length > 0);
  }, [onChange]);

  /**
   * Handles suggestion selection
   * 
   * @param suggestion - Selected emotion suggestion
   */
  const handleSuggestionSelect = useCallback((suggestion: string): void => {
    onChange(suggestion);
    setShowSuggestions(false);
  }, [onChange]);

  /**
   * Handles input focus to show suggestions
   */
  const handleInputFocus = useCallback((): void => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [filteredSuggestions.length]);

  /**
   * Handles input blur to hide suggestions (with delay for click handling)
   */
  const handleInputBlur = useCallback((): void => {
    setTimeout(() => setShowSuggestions(false), 150);
  }, []);

  //#endregion Event Handlers

  return (
    <div className={`enhanced-emotion-input ${className}`} style={{ position: 'relative' }}>
      <label 
        htmlFor="emotion-input"
        style={{ 
          fontWeight: 600, 
          marginBottom: '8px', 
          display: 'block',
          color: '#374151'
        }}
      >
        Current Emotion
      </label>
      
      <input
        id="emotion-input"
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '16px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          outline: 'none'
        }}
      />

      {/* Quick emotion chips */}
      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {EMOTION_SUGGESTIONS.slice(0, 6).map(emotion => (
          <button
            key={emotion}
            type="button"
            onClick={() => handleSuggestionSelect(emotion)}
            style={{
              background: value === emotion ? '#6366f1' : '#f0f4ff',
              color: value === emotion ? 'white' : '#6366f1',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {emotion}
          </button>
        ))}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 10,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {filteredSuggestions.map(suggestion => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '14px',
                border: 'none',
                background: 'transparent',
                width: '100%',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalMoodSelector;
