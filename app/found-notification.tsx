import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function FoundNotificationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const name = params.name as string || '';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* 성공 아이콘 영역 */}
          <View style={styles.iconContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>

          {/* 메시지 영역 */}
          <View style={styles.messageContainer}>
            <ThemedText style={styles.title}>
              좋은 소식입니다!
            </ThemedText>
            {name ? (
              <ThemedText style={styles.message}>
                <Text style={styles.highlight}>{name}</Text>님을 찾았습니다.
              </ThemedText>
            ) : (
              <ThemedText style={styles.message}>
                실종자를 찾았습니다.
              </ThemedText>
            )}
          </View>

          {/* 확인 버튼 */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.buttonText}>홈으로</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkmark: {
    fontSize: 60,
    color: 'white',
    fontWeight: 'bold',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  highlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 150,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

