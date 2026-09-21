// 방 시드 데이터. 실제 서비스가 아닌 컨셉 데모이므로 정적으로 고정합니다.
// searchQuery는 유튜브 임베드 검색 재생목록(listType=search)에 사용됩니다.
export const rooms = [
  {
    id: 'through-the-night',
    song: '밤편지',
    artist: 'IU',
    quote: '어제 남긴 문장을 오늘 다시 읽어도, 여전히 네가 그립다는 말.',
    searchQuery: 'IU 밤편지 Through the Night MV',
    mood: '그리움',
    accent: '#7c8fd8',
  },
  {
    id: 'hello',
    song: '안녕',
    artist: '폴킴',
    quote: '마지막 인사도 못 하고 보낸 사람에게, 뒤늦게 안녕을 건네 본다.',
    searchQuery: '폴킴 안녕 Hello MV',
    mood: '위로',
    accent: '#e8a15c',
  },
  {
    id: 'bird',
    song: '뱁새',
    artist: '잔나비',
    quote: '남들과 다른 속도로 걸어도, 결국 내 걸음으로 여기까지 왔다.',
    searchQuery: '잔나비 뱁새 MV',
    mood: '다짐',
    accent: '#5fb08a',
  },
  {
    id: 'forest',
    song: '숲',
    artist: '최유리',
    quote: '아무 말 없이 걷다 보면, 마음도 나뭇잎처럼 조용해진다.',
    searchQuery: '최유리 숲 MV',
    mood: '고요',
    accent: '#6f9b6f',
  },
  {
    id: 'if-i-love-again',
    song: '다시 사랑한다면',
    artist: 'Standing Egg',
    quote: '다 지나간 줄 알았던 마음이, 노래 한 소절에 다시 차오른다.',
    searchQuery: 'Standing Egg 다시 사랑한다면 MV',
    mood: '미련',
    accent: '#c97b9e',
  },
  {
    id: 'falling-leaves',
    song: '떨어지는 낙엽까지도 (feat. DEAN)',
    artist: '헤이즈',
    quote: '잠들기 직전, 괜찮은 척했던 하루가 결국 무너지는 시간.',
    searchQuery: '헤이즈 떨어지는 낙엽까지도 feat DEAN MV',
    mood: '불면',
    accent: '#8a7fd6',
  },
]

export function getRoomById(id) {
  return rooms.find((room) => room.id === id)
}
