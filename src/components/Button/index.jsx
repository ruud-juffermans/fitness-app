import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@theme/useTheme';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { getFromTheme } from '../../utils/getFromTheme';

const SIZES = {
  sm: { padH: 5, font: 11, icon: 14, height: 26 },
  md: {  padH: 9, font: 13, icon: 16, height: 30 },
  lg: { padH: 12, font: 16, icon: 20, height: 36 },
};

function computeVariantColors(colors, variant) {
  const baseBtnBg    = getFromTheme(colors, 'components.button.backgroundColor', '#1E1E1E');
  const baseBtnText  = getFromTheme(colors, 'components.button.textColor', '#FFFFFF');
  const baseBtnBorder= getFromTheme(colors, 'components.button.borderColor', '#333333');

  switch (variant) {
    case 'primary':
      return {
        bg: baseBtnBg,
        text: baseBtnText,
        border: baseBtnBorder,
      };
    case 'secondary':
      return {
        bg: baseBtnBg,
        text: baseBtnText,
        border: baseBtnBorder,
      };
    case 'outline':
      return {
        bg: 'transparent',
        text: baseBtnText,
        border: baseBtnBorder,
      };
    case 'ghost':
    default:
      return {
        bg: 'transparent',
        text: baseBtnText,
        border: 'transparent',
      };
  }
}

export default function Button({
  title,
  onPress,
  variant = 'primary',      // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'md',              // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  leftIcon,                 // Ionicons name
  rightIcon,                // Ionicons name
  fullWidth = false,
  style,
  textStyle,
  iconProps,
  ...rest
}) {
  const { colors, theme } = useTheme();
  const sz = SIZES[size] ?? SIZES.md;

  const baseRadius   = getFromTheme(colors, 'components.button.borderRadius', 0);
  const baseBWidth   = getFromTheme(colors, 'components.button.borderWidth', 2);
  const baseBorder   = getFromTheme(colors, 'components.button.borderColor', '#333333');

  const c = computeVariantColors(colors, variant);
  const contentColor = c.text;

  return (
    <Pressable
      {...rest}
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.5 : (pressed ? 0.92 : 1),
          backgroundColor: c.bg,
          borderColor: variant === 'outline' ? c.border : (variant === 'secondary' ? baseBorder : c.border),
          borderWidth: variant === 'ghost' ? 0 : baseBWidth,
          minHeight: sz.height,
          paddingHorizontal: sz.padH,
          borderRadius: baseRadius,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          ...(fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'baseline' }),
          ...(variant === 'primary' || variant === 'secondary'),
          shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }
        },
        style,
      ]}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={contentColor} />
      ) : (
        <>
          {leftIcon ? (
            <Ionicons
              name={leftIcon}
              size={sz.icon}
              color={contentColor}
              style={{ marginRight: title ? 8 : 0 }}
              {...iconProps}
            />
          ) : null}
          {title ? (
            <Text
              style={[
                {
                  color: contentColor,
                  fontSize: sz.font,
                  lineHeight: Math.round(sz.font * 1.25),
                  fontWeight: '300',
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          ) : null}
          {rightIcon ? (
            <Ionicons
              name={rightIcon}
              size={sz.icon}
              color={contentColor}
              style={{ marginLeft: title ? 8 : 0 }}
              {...iconProps}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}
