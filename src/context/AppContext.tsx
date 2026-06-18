import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// DATA TYPES DEFINITIONS
// ==========================================

export interface Story {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: string; // "Đang ra", "Hoàn thành", "VIP", "Bản nháp"
  chaptersCount: number;
  views: string;
  likes: string;
  words?: string;
  revenue?: string;
  rating: number;
  coverGradient: string[]; // Gradient colors (hex codes)
  content: string;
  progressPercent: number;
  currentChapter: string;
  isFavorited: boolean;
  isLibrary: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number; // positive for topup, negative for spend
  type: 'TOP_UP' | 'SPEND';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'READER' | 'WRITER' | 'ADMIN';
  status: 'Active' | 'Banned';
  avatarLetters: string;
}

export interface Report {
  id: string;
  subjectTitle: string;
  subjectDetail: string;
  violationType: string;
  riskLevel: string; // e.g., "Cao (AI Generated 98%)", "Trung bình"
  snippetText: string;
  complaintDetail: string;
  status: 'Pending' | 'Approved' | 'Violation';
}

export interface AuthorDraft {
  id: string;
  title: string;
  content: string;
  isVip: boolean;
  coinsPrice: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'chapter' | 'comment' | 'follower' | 'system';
  timestamp: string;
  isRead: boolean;
  highlightQuote?: string;
}

export interface Comment {
  id: string;
  chapterId: string;
  authorName: string;
  text: string;
  timeAgo: string;
  likesCount: number;
  isLiked: boolean;
}

interface AppContextType {
  // Auth state
  currentRole: 'GUEST' | 'READER' | 'WRITER' | 'ADMIN';
  currentUser: string | null;
  setCurrentRole: (role: 'GUEST' | 'READER' | 'WRITER' | 'ADMIN') => void;
  setCurrentUser: (user: string | null) => void;
  login: (email: string, role: 'READER' | 'WRITER' | 'ADMIN') => boolean;
  signOut: () => void;

  // Wallet state
  coinsBalance: number;
  streakCount: number;
  showStreakDialog: boolean;
  setShowStreakDialog: (show: boolean) => void;
  claimStreakReward: () => void;
  topUpCoins: (coins: number, price: number, method: string) => void;
  unlockChapter: (storyId: string, coinsPrice: number) => boolean;

  // Databases
  stories: Story[];
  transactions: Transaction[];
  users: User[];
  reports: Report[];
  drafts: AuthorDraft[];
  notifications: Notification[];
  comments: Comment[];

  // Readers actions
  toggleStoryFavorite: (storyId: string) => void;
  toggleLibraryStatus: (storyId: string) => void;
  saveBookmark: (storyId: string, chapterTitle: string, progress: number) => void;
  likeComment: (commentId: string) => void;
  addComment: (chapterId: string, text: string) => void;

  // Writers actions
  saveDraft: (title: string, content: string, isVip: boolean, price: number) => void;
  submitNewStory: (title: string, genre: string, synopsis: string, tags: string[]) => void;
  deleteStory: (storyId: string) => void;

  // Admin actions
  changeUserStatus: (userId: string, status: 'Active' | 'Banned') => void;
  approveStory: (storyId: string, reportId: string) => void;
  rejectStory: (storyId: string, reportId: string) => void;
  dismissReport: (reportId: string) => void;

  // Filters state for Explore screen
  filterSortBy: string;
  setFilterSortBy: (val: string) => void;
  filterGenres: string[];
  toggleGenreFilter: (genre: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  filterPricing: string;
  setFilterPricing: (val: string) => void;
  resetFilters: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==========================================
// MOCK DATA INITIALIZATION
// ==========================================

const INITIAL_STORIES: Story[] = [
  {
    id: 'tieng_vong_khoi_nguyen',
    title: 'Tiếng Vọng Khởi Nguyên',
    author: 'E.R. Vance',
    genre: 'Viễn Tưởng',
    status: 'VIP',
    chaptersCount: 42,
    views: '12.5k',
    likes: '842',
    rating: 4.8,
    coverGradient: ['#8A2387', '#E94057', '#F27121'],
    content: 'Dưới bầu trời đỏ quạch của hành tinh Kepler-186f, tiếng còi báo động vang lên không dứt. Đội trưởng Minh Phạm đứng trước ô cửa kính của tàu cứu sinh số 7, ngón tay run rẩy chạm vào bề mặt kính lạnh ngắt. Bên ngoài, những đám mây bụi hạt sinh học đang cuộn xiết lấy mái vòm trung tâm. Sự sống cuối cùng của nhân loại đang bị dồn vào chân tường, đứng trước bờ vực thẳm...',
    progressPercent: 65,
    currentChapter: 'Chương 42: Thức Tỉnh',
    isFavorited: true,
    isLibrary: true,
  },
  {
    id: 'ky_si_rong_khuyet_danh',
    title: 'Kỵ Sĩ Rồng Khuyết Danh',
    author: 'NovaTales Writer',
    genre: 'Kỳ Ảo',
    status: 'Đang ra',
    chaptersCount: 15,
    views: '8.4k',
    likes: '620',
    rating: 4.6,
    coverGradient: ['#5341CD', '#160066'],
    content: 'Thế giới ngập tràn hơi sương lạnh của thung lũng rồng cổ xưa. Eric siết chặt chuôi kiếm sứt mẻ. Anh chưa từng được sắc phong kỵ sĩ, cũng chẳng có danh gia vọng tộc đứng sau bảo hộ. Nhưng con rồng đen cánh rách đang gầm gừ trước mặt anh lại hiểu một sự thật: chỉ có lòng dũng cảm điên cuồng mới có thể cứu lấy vương quốc đang lụn bại này khỏi nanh vuốt bóng đêm...',
    progressPercent: 40,
    currentChapter: 'Chương 6: Giao ước máu',
    isFavorited: false,
    isLibrary: true,
  },
  {
    id: 'mat_ma_lang_quen',
    title: 'Mật Mã Lãng Quên',
    author: 'Lê Minh',
    genre: 'Kỳ Ảo',
    status: 'VIP',
    chaptersCount: 128,
    views: '89.2k',
    likes: '5.6k',
    rating: 4.9,
    coverGradient: ['#0F2027', '#203A43', '#2C5364'],
    content: 'Tấm bản đồ da dê cổ xưa đặt trên chiếc bàn gỗ lim mục nát. Từng nét mực mạ vàng nhấp nháy theo ánh nến leo lét phản chiếu bóng đen dài trên tường phòng thí nghiệm. Minh Phạm nheo mắt nhìn dòng chữ cổ ngữ phát sáng. Mật mã này đã bị chôn vùi hơn 300 năm, và giờ đây, nó đang thì thầm bên tai anh về kho báu có thể làm đảo lộn dòng chảy thời gian của lục địa đen...',
    progressPercent: 0,
    currentChapter: 'Chưa đọc',
    isFavorited: true,
    isLibrary: false,
  },
  {
    id: 'nhung_canh_thu_bo_ngo',
    title: 'Những Cánh Thư Bỏ Ngỏ',
    author: 'Vũ Trần',
    genre: 'Lãng Mạn',
    status: 'Bản nháp',
    chaptersCount: 3,
    views: '0',
    likes: '0',
    rating: 0,
    coverGradient: ['#11998e', '#38ef7d'],
    content: 'Trong hộc bàn gỗ cũ kỹ phủ đầy bụi thời gian, những bức thư viết tay màu giấy úa vàng vẫn nằm im lìm suốt hai mươi năm. Hoa vẫn gửi đi tình cảm thầm lặng của mình vào hư không, không mong hồi đáp. Những dòng chữ nghiêng nghiêng chứa đựng thanh xuân ngây ngô và những lời hứa chưa kịp nói...',
    progressPercent: 0,
    currentChapter: 'Chưa đọc',
    isFavorited: false,
    isLibrary: false,
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-001', title: 'Nạp Gói 500 Coins', date: '18 thg 6, 14:30', amount: 500, type: 'TOP_UP' },
  { id: 'TXN-002', title: 'Mở khóa Chương 42: Bí mật', date: '17 thg 6, 21:15', amount: -15, type: 'SPEND' },
  { id: 'TXN-003', title: 'Mở khóa Chương 41: Lời hứa', date: '17 thg 6, 20:50', amount: -15, type: 'SPEND' },
  { id: 'TXN-004', title: 'Nạp Gói Tân thủ (1000 Coins)', date: '05 thg 6, 09:00', amount: 1000, type: 'TOP_UP' }
];

const INITIAL_USERS: User[] = [
  { id: 'USR-001', name: 'Minh Phạm', email: 'docgianova@gmail.com', role: 'READER', status: 'Active', avatarLetters: 'MP' },
  { id: 'USR-002', name: 'Vũ Trần', email: 'writer@novatales.com', role: 'WRITER', status: 'Active', avatarLetters: 'VT' },
  { id: 'USR-003', name: 'Admin Nova', email: 'admin@novatales.com', role: 'ADMIN', status: 'Active', avatarLetters: 'AD' },
  { id: 'USR-004', name: 'Nguyễn Văn A', email: 'vanna@gmail.com', role: 'READER', status: 'Banned', avatarLetters: 'VA' },
  { id: 'USR-005', name: 'Trần B', email: 'tranb@gmail.com', role: 'READER', status: 'Active', avatarLetters: 'TB' }
];

const INITIAL_REPORTS: Report[] = [
  {
    id: 'REP-001',
    subjectTitle: 'Mật Mã Lãng Quên - Chương 1',
    subjectDetail: 'Đoạn văn thứ 3, dòng 15-20',
    violationType: 'Trùng lặp nội dung / Vi phạm AI',
    riskLevel: 'Cao (AI Generated 98%)',
    snippetText: 'Từng nét mực mạ vàng nhấp nháy theo ánh nến leo lét phản chiếu bóng đen dài trên tường phòng thí nghiệm...',
    complaintDetail: 'Nội dung này giống hệt các câu chuyện giả tưởng trên mạng, nghi ngờ tác giả sao chép 100% hoặc dùng AI sinh văn bản không kiểm duyệt.',
    status: 'Pending'
  },
  {
    id: 'REP-002',
    subjectTitle: 'Kỵ Sĩ Rồng Khuyết Danh - Chương 3',
    subjectDetail: 'Giới thiệu tác phẩm',
    violationType: 'Quảng cáo trái phép / Spam',
    riskLevel: 'Thấp',
    snippetText: 'Hãy click vào link bên dưới để nhận phần thưởng trị giá 100k ngay lập tức!',
    complaintDetail: 'Tác giả chèn link spam cờ bạc quảng cáo ở cuối chương làm gián đoạn trải nghiệm người đọc trầm trọng.',
    status: 'Pending'
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    title: 'Tác phẩm mới cập nhật',
    message: 'Tác giả E.R. Vance vừa đăng tải Chương 42 của "Tiếng Vọng Khởi Nguyên". Hãy thưởng thức ngay!',
    type: 'chapter',
    timestamp: '15 phút trước',
    isRead: false
  },
  {
    id: 'NOT-002',
    title: 'Phản hồi bình luận mới',
    message: 'Độc giả Vũ Trần đã trả lời bình luận của bạn trong chương 6 truyện "Kỵ Sĩ Rồng Khuyết Danh".',
    type: 'comment',
    timestamp: '2 giờ trước',
    isRead: false,
    highlightQuote: '"Đứng trước bờ vực thẳm, không ai có thể quay đầu..." - Tôi rất đồng tình với góc nhìn u tối này!'
  },
  {
    id: 'NOT-003',
    title: 'Cập nhật Hệ thống bảo trì',
    message: 'Hệ thống NovaTales sẽ tiến hành nâng cấp máy chủ bảo mật định kỳ vào lúc 02:00 đến 04:00 ngày 20/06. Vui lòng lưu ý.',
    type: 'system',
    timestamp: '1 ngày trước',
    isRead: true
  }
];

const INITIAL_COMMENTS: Comment[] = [
  { id: 'COM-001', chapterId: 'tieng_vong_khoi_nguyen', authorName: 'Hoàng Long', text: 'Tuyệt phẩm! Đoạn văn tả Keppler u ám lột tả được trọn vẹn nỗi cô đơn của nhân loại.', timeAgo: '5 phút trước', likesCount: 24, isLiked: true },
  { id: 'COM-002', chapterId: 'tieng_vong_khoi_nguyen', authorName: 'Quỳnh Hương', text: 'Tình tiết kịch tính quá, không biết đội trưởng Minh Phạm có sống sót không?', timeAgo: '2 giờ trước', likesCount: 12, isLiked: false },
  { id: 'COM-003', chapterId: 'ky_si_rong_khuyet_danh', authorName: 'Văn Thanh', text: 'Con rồng đen có bí mật gì chăng? Thiết kế nhân vật Eric rất chân thực.', timeAgo: '1 ngày trước', likesCount: 45, isLiked: false }
];

// ==========================================
// CONTEXT PROVIDER COMPONENT
// ==========================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication Role Gate State
  const [currentRole, setCurrentRole] = useState<'GUEST' | 'READER' | 'WRITER' | 'ADMIN'>('GUEST');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // App database states
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [drafts, setDrafts] = useState<AuthorDraft[]>([]);

  // Wallet and Streaks States
  const [coinsBalance, setCoinsBalance] = useState<number>(2450);
  const [streakCount, setStreakCount] = useState<number>(5);
  const [showStreakDialog, setShowStreakDialog] = useState<boolean>(false);

  // Filters state for Explore screen
  const [filterSortBy, setFilterSortBy] = useState<string>('popularity');
  const [filterGenres, setFilterGenres] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPricing, setFilterPricing] = useState<string>('all');

  // Trigger Streak Award Dialog dynamically on start
  useEffect(() => {
    if (currentRole === 'READER') {
      const timer = setTimeout(() => {
        setShowStreakDialog(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentRole]);

  // Auth Operations
  const login = (email: string, role: 'READER' | 'WRITER' | 'ADMIN'): boolean => {
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      if (matchedUser.status === 'Banned') {
        return false; // Cannot log in if banned
      }
      setCurrentUser(matchedUser.name);
      setCurrentRole(role);
      return true;
    }
    // Create new reader dynamically if it is a new email
    const newLetters = email.substring(0, 2).toUpperCase();
    const newName = email.split('@')[0];
    const newUser: User = {
      id: `USR-${users.length + 1}`,
      name: newName.charAt(0).toUpperCase() + newName.slice(1),
      email: email.toLowerCase(),
      role: role,
      status: 'Active',
      avatarLetters: newLetters
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser.name);
    setCurrentRole(role);
    return true;
  };

  const signOut = () => {
    setCurrentRole('GUEST');
    setCurrentUser(null);
  };

  // Wallet Operations
  const claimStreakReward = () => {
    setCoinsBalance(prev => prev + 50);
    setStreakCount(prev => prev + 1);
    setTransactions(prev => [
      {
        id: `TXN-${prev.length + 1}`,
        title: 'Nhận xu chuyên cần (Streak)',
        date: 'Hôm nay, vừa xong',
        amount: 50,
        type: 'TOP_UP'
      },
      ...prev
    ]);
    setShowStreakDialog(false);
  };

  const topUpCoins = (coins: number, price: number, method: string) => {
    setCoinsBalance(prev => prev + coins);
    setTransactions(prev => [
      {
        id: `TXN-${prev.length + 1}`,
        title: `Nạp Gói ${coins} Coins qua ${method}`,
        date: 'Hôm nay, vừa xong',
        amount: coins,
        type: 'TOP_UP'
      },
      ...prev
    ]);
  };

  const unlockChapter = (storyId: string, coinsPrice: number): boolean => {
    if (coinsBalance >= coinsPrice) {
      setCoinsBalance(prev => prev - coinsPrice);
      const targetStory = stories.find(s => s.id === storyId);
      const title = targetStory ? targetStory.title : 'chương VIP';
      setTransactions(prev => [
        {
          id: `TXN-${prev.length + 1}`,
          title: `Mở khóa chương ${title}`,
          date: 'Hôm nay, vừa xong',
          amount: -coinsPrice,
          type: 'SPEND'
        },
        ...prev
      ]);
      return true;
    }
    return false;
  };

  // Readers Actions
  const toggleStoryFavorite = (storyId: string) => {
    setStories(prev =>
      prev.map(story =>
        story.id === storyId ? { ...story, isFavorited: !story.isFavorited } : story
      )
    );
  };

  const toggleLibraryStatus = (storyId: string) => {
    setStories(prev =>
      prev.map(story =>
        story.id === storyId ? { ...story, isLibrary: !story.isLibrary } : story
      )
    );
  };

  const saveBookmark = (storyId: string, chapterTitle: string, progress: number) => {
    setStories(prev =>
      prev.map(story =>
        story.id === storyId
          ? {
              ...story,
              progressPercent: Math.round(progress),
              currentChapter: chapterTitle,
              isLibrary: true // Automatically add to library when reading progress begins
            }
          : story
      )
    );
  };

  const likeComment = (commentId: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1 }
          : c
      )
    );
  };

  const addComment = (chapterId: string, text: string) => {
    const newComment: Comment = {
      id: `COM-${comments.length + 1}`,
      chapterId: chapterId,
      authorName: currentUser || 'Minh Phạm',
      text: text,
      timeAgo: 'Vừa xong',
      likesCount: 0,
      isLiked: false
    };
    setComments(prev => [...prev, newComment]);
  };

  // Writers Actions
  const saveDraft = (title: string, content: string, isVip: boolean, price: number) => {
    const newDraft: AuthorDraft = {
      id: `DFT-${drafts.length + 1}`,
      title,
      content,
      isVip,
      coinsPrice: price
    };
    setDrafts(prev => [...prev, newDraft]);

    // Also inject it into the stories database as "Bản nháp" status
    const randomGradients = [
      ['#F12711', '#F5AF19'],
      ['#654ea3', '#eaafc8'],
      ['#00B4DB', '#0083B0'],
      ['#696969', '#000000']
    ];
    const picked = randomGradients[Math.floor(Math.random() * randomGradients.length)];
    const newStory: Story = {
      id: `story_draft_${stories.length + 1}`,
      title,
      author: currentUser || 'Vũ Trần',
      genre: 'Viễn Tưởng',
      status: isVip ? 'VIP' : 'Bản nháp',
      chaptersCount: 1,
      views: '0',
      likes: '0',
      words: `${content.split(/\s+/).filter(Boolean).length} Chữ`,
      rating: 0,
      coverGradient: picked,
      content: content,
      progressPercent: 0,
      currentChapter: 'Chưa đọc',
      isFavorited: false,
      isLibrary: false
    };
    setStories(prev => [...prev, newStory]);
  };

  const submitNewStory = (title: string, genre: string, synopsis: string, tags: string[]) => {
    const randomGradients = [
      ['#f857a6', '#ff5858'],
      ['#11998e', '#38ef7d'],
      ['#0F2027', '#203A43'],
      ['#fc00ff', '#00dbde']
    ];
    const picked = randomGradients[Math.floor(Math.random() * randomGradients.length)];
    const newStory: Story = {
      id: `story_new_${stories.length + 1}`,
      title: title,
      author: currentUser || 'Vũ Trần',
      genre: genre,
      status: 'Đang ra',
      chaptersCount: 1,
      views: '1.2k',
      likes: '104',
      rating: 4.5,
      coverGradient: picked,
      content: synopsis,
      progressPercent: 0,
      currentChapter: 'Chưa đọc',
      isFavorited: false,
      isLibrary: false
    };
    setStories(prev => [...prev, newStory]);
  };

  const deleteStory = (storyId: string) => {
    setStories(prev => prev.filter(story => story.id !== storyId));
  };

  // Admin Operations
  const changeUserStatus = (userId: string, status: 'Active' | 'Banned') => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: status } : u))
    );
  };

  const approveStory = (storyId: string, reportId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, status: 'Đang ra' } : s))
    );
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const rejectStory = (storyId: string, reportId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const dismissReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  // Advanced Filters toggle
  const toggleGenreFilter = (genre: string) => {
    setFilterGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const resetFilters = () => {
    setFilterSortBy('popularity');
    setFilterGenres([]);
    setFilterStatus('all');
    setFilterPricing('all');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        setCurrentRole,
        setCurrentUser,
        login,
        signOut,
        coinsBalance,
        streakCount,
        showStreakDialog,
        setShowStreakDialog,
        claimStreakReward,
        topUpCoins,
        unlockChapter,
        stories,
        transactions,
        users,
        reports,
        drafts,
        notifications,
        comments,
        toggleStoryFavorite,
        toggleLibraryStatus,
        saveBookmark,
        likeComment,
        addComment,
        saveDraft,
        submitNewStory,
        deleteStory,
        changeUserStatus,
        approveStory,
        rejectStory,
        dismissReport,
        filterSortBy,
        setFilterSortBy,
        filterGenres,
        toggleGenreFilter,
        filterStatus,
        setFilterStatus,
        filterPricing,
        setFilterPricing,
        resetFilters
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
