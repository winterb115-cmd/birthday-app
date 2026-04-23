import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { getCharactersByMonth } from '@/src/data/embeddedData';
import type { Character } from '@/src/data/types';

const currentMonth = new Date().getMonth() + 1;

export default function DashboardScreen() {
  const characters = getCharactersByMonth(currentMonth);

  const renderItem = ({ item }: { item: Character }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.date}>{item.birthday.month}월 {item.birthday.day}일</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이달의 주인공 🎂</Text>
      {characters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>이번 달에는 생일인 캐릭터가 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
