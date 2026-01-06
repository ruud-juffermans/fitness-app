import { Text } from "@components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@theme/useTheme";
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { Pressable, TextInput, View } from "react-native";

function clamp(n, min, max) {
    if (min !== undefined && n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
}

function parseInteger(raw, allowNegative) {
    let s = raw.replace(/[^\d-]/g, "");
    if (!allowNegative) s = s.replace(/-/g, "");
    else s = s.replace(/(?!^)-/g, ""); // only one leading '-'
    if (s === "" || s === "-") return { text: s, num: null };
    const num = Number.parseInt(s, 10);
    if (Number.isNaN(num)) return { text: s, num: null };
    return { text: s, num };
}

const RepField = forwardRef(
    (
        {
            // existing props
            label,
            helperText,
            errorText,
            locked,
            value,
            defaultValue = null,
            onChangeNumber,

            min,
            max,
            step = 1,
            allowNegative = false,
            required = false,

            clearable = true,
            disabled = false,

            leftIconName,
            rightIconName,
            onLeftIconPress,
            onRightIconPress,

            containerStyle,
            inputStyle,

            placeholder,

            // NEW: unit text shown to the right of the input
            unitLabel,             // e.g. "reps"
            unitLabelStyle,

            ...rest
        },
        ref
    ) => {
        const { colors, components } = useTheme();
        const c = components.logControls;
        const inputRef = useRef(null);

        const [text, setText] = useState(
            defaultValue === null || defaultValue === undefined
                ? ""
                : String(Math.trunc(defaultValue))
        );

        const currentNumber = useMemo(() => {
            const n = Number.parseInt(text, 10);
            return Number.isNaN(n) ? null : n;
        }, [text]);

        useEffect(() => {
            if (value === undefined) return; // uncontrolled
            const next = value === null ? "" : String(Math.trunc(value));
            setText(next);
        }, [value]);

        const emit = useCallback(
            (n) => {
                onChangeNumber?.(n);
            },
            [onChangeNumber]
        );

        const handleChangeText = useCallback(
            (raw) => {
                const { text: cleaned, num } = parseInteger(raw, allowNegative);
                setText(cleaned);
                emit(num);
            },
            [allowNegative, emit]
        );

        const commitWithClamp = useCallback(
            (n) => {
                let next = n;
                if (next === null) {
                    if (required) next = min ?? 0;
                } else {
                    next = clamp(next, min, max);
                    if (!allowNegative && next < 0) next = 0;
                }
                setText(next === null ? "" : String(next));
                emit(next);
            },
            [allowNegative, max, min, required, emit]
        );

        const onBlur = useCallback(() => {
            commitWithClamp(currentNumber);
        }, [commitWithClamp, currentNumber]);

        const increment = useCallback(() => {
            const base = currentNumber ?? (required ? (min ?? 0) : 0);
            commitWithClamp(base + step);
        }, [commitWithClamp, currentNumber, step, min, required]);

        const decrement = useCallback(() => {
            const base = currentNumber ?? (required ? (min ?? 0) : 0);
            commitWithClamp(base - step);
        }, [commitWithClamp, currentNumber, step, min, required]);

        useImperativeHandle(ref, () => ({
            focus: () => inputRef.current?.focus(),
            blur: () => inputRef.current?.blur(),
            getNumber: () => currentNumber,
            setNumber: (n) => commitWithClamp(n),
        }));

        const incDecStyle = {
            height: c.height,
            width: c.height,
            borderRadius: c.borderRadius,
            borderWidth: c.borderWidth,
            backgroundColor: c.backgroundColor,
            borderColor: c.borderColor,
            opacity: disabled ? 0.6 : 1,
            alignItems: "center",
            justifyContent: "center",
        }

        const fieldStyle = {
            height: c.height,
            borderRadius: c.borderRadius,
            borderWidth: c.borderWidth,
            backgroundColor: c.backgroundColor,
            borderColor: c.borderColor,
            opacity: disabled ? 0.6 : 1,
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
        }

        return (
            <View style={[{ flex: 1 }]}>
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flexDirection: "row",
                        gap: c.spacing
                    }}
                >
                    <View style={fieldStyle}>
                        <TextInput
                            ref={inputRef}
                            editable={!disabled}
                            value={text}
                            onChangeText={handleChangeText}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            returnKeyType="done"
                            style={[
                                {
                                    flex: 1,
                                    textAlign: "center",
                                    paddingVertical: 6,
                                    color: c.color


                                },
                                inputStyle,
                            ]}
                            {...rest}
                        />

                        <Text
                            style={[
                                {
                                    display: "absulute",
                                    flex: 1,
                                    color: "white",
                                    // opacity: disabled ? 0.6 : 1,
                                },
                                unitLabelStyle,
                            ]}
                            numberOfLines={1}
                        >
                            Reps
                        </Text>

                    </View>

                    <Pressable
                        onPress={decrement}
                        disabled={disabled}
                        hitSlop={10}
                        style={incDecStyle}
                    >
                        <Ionicons name="remove-outline" size={20} color={c.color} />
                    </Pressable>

                    <Pressable
                        onPress={increment}
                        disabled={disabled}
                        hitSlop={10}
                        style={incDecStyle}
                    >
                        <Ionicons name="add-outline" size={20} color={c.color} />
                    </Pressable>
                </View>
            </View>
        );
    }
);

export default RepField;
