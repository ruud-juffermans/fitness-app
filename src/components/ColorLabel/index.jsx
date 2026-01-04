import { Small } from '../Typography';
import { View } from 'react-native';
import { useTheme } from '@theme/useTheme';

const ColorLabel = ({ text, color }) => {
  const { colors } = useTheme();
  return (
    <View style={{
      alignSelf: "flex-start",
      paddingHorizontal: 6,
      paddingVertical: 2,
      backgroundColor: color
    }}>
      <Small>{text}</Small>
    </View>
  );
}

export default ColorLabel