import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
};

export default function LabelBadge({ label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
    color: '#000000',
    textAlign: 'center',
  },
});
