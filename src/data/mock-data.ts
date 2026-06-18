import type { Book, ChapterUpdate, CommunityPost, ReadingList, WalletTransaction } from '@/types/book';

export const FEATURED_BOOK: Book = {
  id: 'featured-1',
  title: 'Vũ Trụ Của Những Giấc Mơ',
  author: 'Nguyễn Nhật Nam',
  coverUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCZppiLDpsU7xFu45o-zZmsZdsKPzPDic8pKuGUTymVWxlYnaeqtagav_2tQQTJYWKcJqABq8Dv5vhrto4yNovIK1hx1UmIeKtEjT0Bm5wm4_SrrVJQgcUu84qzfu380P_zMwpOgxlu2UX1UW6WljcmXio4LL2jlMa6wYjzUAK9BjUn2oYlsbKscO4iVGwqKMAxoujs4Nt1k0GKrV8pn8roR5ZMG19rwupTATaDZyWhqPzASVZCQesy0B9ena2L6y5kUygKB26wGtQF',
  rating: 4.9,
  genres: ['Tiểu thuyết', 'Đương đại'],
  synopsis:
    'Khám phá hành trình đầy mê hoặc giữa thực tại và mộng tưởng của tác giả Nguyễn Nhật Nam.',
};

export const TRENDING_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Đêm Dài Vô Tận',
    author: 'Trần Minh Quân',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5P6_0u9skyu8yf73TOYve8B8pfR6ExtVkllwOKHRsxM3iifey1GB4Ajvz64w4g0R7goXtwimww0ePY648xpJUpbq7IMrVVGosXmJTZX0QKXxprQuI5KMxOf34MqFl--1kQXkPMxxoqzmSwJ8ajFSSSojzJv7y7KFL3mWRh6isGJ60AMxeomiR2XHtNtUsk2ft3rKyHV3Co7JQzZzrCvSVRKmtmjIPhtJnvrtgYp_q3VChWg-CSY20-4uDHYcwgkIppZu_W-ihpF9q',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Phía Sau Đồi Thông',
    author: 'Lê Thị Thu Hà',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXn2n_L5ATbjMaGrV_HhO4oDhcIQA9AAKW4mflftkOcRM7vLhVcPFwmMzNKUCM7rD5oiUZC36l485Sdf8nv0EWOmaGh9WOEfDL2ST2mFiZa3uNKVufwj8CLzxci1_qRDsrdr6sczf8MSajs7Gv4ClL8PJEnsFNRoqICl-i-esBpQ3imCLsTbd43CBarOdATT3yy-aW6wIiWRzp7hsNDUtzM34E-BMu-l5B3ress21DqmLxn2V4iRbqoTt4fLXeNYo2B98WNBZ5kZkX',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Kiến Trúc Tâm Hồn',
    author: 'Hoàng Bách',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjCP6NcFYRR1S2lmTGrw5QmX_BwPnFP9VMcEZTaZy_nmKDsqx4KsHLIkgrTPmJdyJkzsOL60L7rTgh4dlUOMs-7qRPdGtmKIEM3RbKk4Da92tOXpElZhyf6USHy-OXvKDxFsEHuGjPbexb9iq2G2zEnEDQiHz49_R_28bNTSMpNvsXbaiB553JwfAX2NjjlVZMQ5AzcGSSOvo66e4yMsULH_subDePj0Xf9mhlYYc83GAsEQqhTxriZticvlyhge1dJIuboCpyGnkG',
    rating: 4.6,
  },
  {
    id: '4',
    title: 'Di Sản Của Tổ Tiên',
    author: 'Ngô Gia Bảo',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQqaiWQpY7k5Sd4rDp9M87ZARkyXpwDYF_lkkwwAHVAAnKOausEBI3uhyS20uzb1FHba4smeuqUHzLFPL6qwlVGhf0SPuak4sRTaUTgW7WszyxSX-GDj9lD8ECJmeKGVMRWAuMO8EWJyRxTeNksX7wgAyiTCoqwg6xZpxSQyav_S14qnDhoY9kyVvla8Din2OT7hry_wdh-eSK4zreWe8cfhThtKtQwAPPzlh2MtPuXFi9fK6EbAnemxK11-5EPR48cBWdU68ir2EK',
    rating: 4.5,
  },
];

export const RECOMMENDED_BOOKS: Book[] = [
  {
    id: '5',
    title: 'Những Hạt Bụi Vàng',
    author: 'Thanh Huyền',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4zqtNHSXWspOsfI8cwtnSJVHxSUS0BbozrnPfNWarAgG8LDoC-n-dGOdkeHqvVU_waR4pRbeAgZK_uUSKAMrwOCQzQgl1NmTSJSrYkR2tEFDuzx7rO1vhAcKuyJ_EKa_QNY0mJe9tvBxqvnZoYG-LrOFkotJVhYQeyrv1emOxF8uvmhrZ1FIdFIliMEPCf_uRg_i79_CJhayrpiVltSprv9E6cPL3JJUh3fBbwh-6xUI9gB35-odUXNZkdT9UVFTZLcyQ_p0KWY2v',
    rating: 4.9,
    genres: ['Tâm lý'],
  },
  {
    id: '6',
    title: 'Vết Mực Thời Gian',
    author: 'Quang Đại',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDiUnktlUnQqFPSVOW0Hwr1lOljVzv3HxWvT3dQF8MmD1mAsMVEGh6IEQvpM4IZTaHcW-SOdW6oSD2q2BAkUkMNRzbKRKpRGfh0L3ZIFYhR5pYjtwOLKZcfgNsuMDmcROzxTlplXGqFkaGx7gUFothgclVef1OgWgoFJZlGtYcr0xjepLPEhsECBSzNuZM5Qma6x6_Fe95YbOcP80bPhcH99duIIpvV3sen0Mi9WbEVnyGylMSizqAs8zHi1Zd3aUhF1WIFY3WFKXO5',
    rating: 4.7,
    genres: ['Hồi ký'],
  },
];

export const CHAPTER_UPDATES: ChapterUpdate[] = [
  {
    id: 'u1',
    bookId: '7',
    title: 'Bóng Tối Sau Cửa Sổ',
    chapter: 'Chương 42: Lời giải cuối cùng',
    timeAgo: '15 phút trước',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHTXkc3QJSNdR42fD756M3K-TVPxpXRcDceclY7XBPsQ2qx8qVftNxpDBbCYEQ67l5sdQkvgQJp8jREpWT4Y3cSO7Dx8MnMaupEh9AsbZjEeEiVtsW0wGykfuoVjQxGsyc6F3udd_ezd-5LCVteo8rkvZqsHa_suC2EQ2e63zNbQ82BzG3nKcbCf-C18vmJh3NTOoNvy6jfGFs9lWvMncX4yyxWfHrSssI5sgtHBYfz6KZzzHT5yt1WfzyBYJtAXDtMbYjcV5TeyMj',
  },
  {
    id: 'u2',
    bookId: '8',
    title: 'Góc Nhỏ Bình Yên',
    chapter: 'Chương 15: Hương trà sớm',
    timeAgo: '1 giờ trước',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3Qm5kSNFd6dQxXxIIF-_ElR_t9ZPge1MSy-CVGWApIddevzRkNRjhiLw_1BJ1cgSqsOhYS6y0g8ktfKibAKXU0YdW5Ss7qUzurz8AzoXkY7yON85KXhwR612ryqWHCP4s-6OjuvHZWKvA639nRg-GwdtDqeNKcYbnKz9F4ajlt1ICc_XRvONjKB9oEP0j4KZ_dPxeEPYiu93iM9bAbCkZ7R182bl_WzL8LNUmM3K67i9ThO63fRxbNPJoHbLKe5vn37mALq1c-zx',
  },
  {
    id: 'u3',
    bookId: '9',
    title: 'Hành Tinh Lẻ Loi',
    chapter: 'Chương 8: Tiếp cận',
    timeAgo: '3 giờ trước',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDN0xypK_xCvKbJDz5bCpKf2qOr3ppRbfpvihD1rjEbYkkQrzT38fiiOWky1xuD2oN3iw2jDilr6TtTnHVea2BV6VY1HgqDmUUb_HdpC9GHzXvMjtHyJv7Xj7yl6jZx2J1XRcGPs4NMr5EewvmgZmYUWqAxg9sDs814wCqwbBPKCk2RdryMjlvcdCOBKFq3Vpdrc5m9RU7mBAW6nmyswpgPI_cHSjvAFpk0vdmmwUUUX84NIjMMbAq9EzJYEDLNe69vqjLSdA0I58-H',
  },
];

export const LIBRARY_BOOKS: Book[] = [
  {
    id: '10',
    title: 'Cánh Đồng Bất Tận',
    author: 'Nguyễn Du',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAoWzeKLCFbDfDMNt34AXLxvch9NhHG6CQpChj4gGsDrrGPEtOj8LZionqCZrLJKwCvQNeloMb-2CBe-Lz7efZLX7eNYFVkCi5YPurHnO6FnplmCbZuhtKa8T_OzGSMJfn4xqGoIPzqjHRMiOWTmoV1AiGv75XRGcVtjqXjNZffo8Dr1H8XdYQInVWiuA6TTQCC-RMBz3nIuRgVAeXqdJ8hQF4dA4cu5mVtUKr7RX9VxAt3q2CkWAB4HeOnfwxHCLDMZm586mXQoSpS',
    rating: 4.8,
  },
  {
    id: '11',
    title: 'Mắt Biếc',
    author: 'Nguyễn Nhật Ánh',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHT0Sd7NahCiHqQu4iqNoP77t7Ry9AznBwe-nhh8hTBT9zDvdef-ukxbdwPQoHm1xIw-sILfDLYhTiVCorM2Mm4I2goxV9sLUCxQiOUeyiOIkNj4EKYq06dmCTdlvCdu98oKJ9NKcEZP6-VO2j2ZT6N1DptaFZU30lBH40CyWCmI_CF9X87nRLKUv_1TCskTegGsVD2FmVadI-o20rxHUY3IU67NOmfd62_Jd4ThVxZYPS8gMzv26ATha9Fj3rBM7cNOVFKzJj9exF',
    rating: 4.9,
  },
  {
    id: '12',
    title: 'Lối Sống Tối Giản',
    author: 'Marie Kondo',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFHrqRNmdG6uxMbxbibHThadXk8xyxJdtMbrY_sqLMrNzScXrvRw06rfyCIOnSf2Az-p31w3WaaW5up8bEbOAWuILrwAlG5e3tvtvUr19UKpVJUcmj2z944d-wzr8DmEnFspJVnJMlljmtNvETyrWDt8pyF4fV23Q-2TPorESoq5xN4hasr_ge1VE-BPBMSoiRBJV5kqAvQJOtqIqt4MXXPNCNIrhv9bbWFT_ti0TyC-6HCgnm3Luk9qOHC8kCk0uWQlwAv5te_mok',
    rating: 4.5,
  },
  {
    id: '13',
    title: 'Những Kẻ Mộng Mơ',
    author: 'Albert Camus',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEkEIVV1Fzd5_wrBpSv_K8nIvAKenUB6cJtAf6hz8BeEGqEnFqXBKk_13Ek4FSvMRFfMPcFUhLoulqzQKdpvNM_Eap9rzjNZFr_y_4sGoN6SWy6ld_Yo-8pZq-YKznDVhh1V5YbSFqt9Jp0EqiWYrcMmKxZBhqfIW7VQ8Yh33v58cYORlmUt0c7jll4bRkTp4jMrRI-f0ab_xTh9zhMdAT0J6y-ic-lLdpcSW5WTsMn_gx_tDQaLVtgmEMTsP_Gl9Bgj3IJCWnTZ_F',
    progress: 45,
    rating: 4.7,
  },
];

export const BOOK_DETAIL: Book = {
  id: 'detail-1',
  title: 'Dấu chân của Gió',
  author: 'Nguyễn Nhật Nam',
  coverUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6ihVZxIbF-xIpuFcJImRAUVNS0qIIUmTp03kM7aTVxZo94PM14-qMDZwZ1tpLSbLYpXt5-KGCut1UDEdLx34nJiJjtteRAcyfTA-uruU1xtQ2CKPHlFaXQ8xNaQJ8lvqN9UlSuzRRkeC9rDhsyAbT_n9frxoyxThXeIgOBvxxvrjm8wTvsFcqGZpp3lbdFAkn76E3UpW-chDWCKrqAg4Wa6u71dIz_CThwE_dGo_yIeu985lJt5sf2MERmpRhcAdhwsP2bPuQiK2i',
  rating: 4.8,
  reads: 12500,
  genres: ['Tiểu thuyết', 'Lãng mạn', 'Đương đại'],
  synopsis:
    'Một hành trình đầy mê hoặc qua những vùng đất chưa từng được biết đến của tâm hồn. "Dấu chân của Gió" không chỉ kể về cuộc đời của một người lữ hành, mà còn là bản tình ca về sự tự do và lòng trắc ẩn.',
  chapterCount: 68,
  chapters: [
    { number: 1, title: 'Tiếng gọi từ phương Bắc' },
    { number: 2, title: 'Ký ức nhạt nhòa' },
    { number: 3, title: 'Cánh cửa bí mật' },
  ],
  content: [
    'Ánh trăng tan loãng trên những tán thông già, đổ xuống mặt đường mòn một thứ ánh sáng bàng bạc, hư ảo. Gió cao nguyên thổi thốc qua khe cửa, mang theo mùi của nhựa thông và hơi ẩm của đất sau cơn mưa chiều.',
    'Minh tựa lưng vào vách gỗ, hơi ấm từ tách trà gừng trong tay không đủ để xua đi cái lạnh đang len lỏi vào tận xương tủy.',
    '"Cậu vẫn chưa ngủ sao?" Giọng của Linh vang lên nhẹ tênh, phá tan bầu không khí tĩnh lặng của căn chòi nhỏ.',
    'Minh lắc đầu, mỉm cười nhạt: "Cái không khí này làm người ta khó mà nhắm mắt được."',
    'Linh im lặng một lúc lâu. Cô nhìn về phía những ánh đèn xa tắp của thị trấn, trông như những con đom đóm bị lạc trong biển mây mù.',
  ],
};

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    author: 'Minh Phan',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUSQAaGMmZAxWTJHy8gWLOqeDyPqeMgPJj7UzqD9-v8feI2iCfkf5HU0lLmv4Xv3253JhoWPpFkAyAlbZyiB3C3VawljhANVIqtBuB39m0RQ1IHmuDieBst25YgZi6BBcgjkXSysfEzFWA0QITfCuVIshsyYtIKKiCvngoU1aW2CQGHG95P_fLOHDH8J3iCjD7EKM4Macf98Ssoi9oIATPJziLRSOZ12xSTbPQQcRsGiMTdskceicRBm1enDvaEVxLdKIM2t43Lxtm',
    subtitle: 'Vừa đăng về "Nhà Giả Kim"',
    content:
      'Đoạn trích này thực sự làm mình thay đổi góc nhìn về những khó khăn trong cuộc sống. Các bạn nghĩ sao?',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdhYcLaMd7t7KlGs0v9UWHOdl0jHjBEqIKdQO8lCDK4DfcvhcIGoacf7K7hJIZ1NSjYtRZdDY3V4poaKH3N-G2dWNU-tLI7JSZ2JaTiWEmiXJrIvF9ojtdk6lrKqik6KVLsthcz1EYWmEsCS_hJBVeMsNgNvHTd03wA2x9cYNpegUpJU_5GlYQucUIFziIOl-7KPQx6pE2Ye5QmPlk9Fzl46p2-BvYcw1ldI_YWCXyqU9VAblujEZ9USD5CLnjd5LM0TXApTY7bo9t',
    quote: 'Khi bạn khao khát một điều gì đó, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.',
    likes: 128,
    comments: 42,
  },
  {
    id: 'p2',
    author: 'Lan Anh',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBItxp1aEfq5LRtBvKWzLkSRd2VqRDpQSt7GEV2bYuveAFaUV6WDx33ZXsVK8CdGtc4pXTUtZN7zWjFEZSraviSWoI-X8YDows2GShPdE0oU1QZn98z7KMxkgXnFSDw2lfmgi8eduzj9G6KHi7yKxupIjsRSAeEl3ftUQaWkA9k-5z0eyFGVym0jG3apdQnyNhC9bR9_zu5SYUSA9RzJ1Fd-bWdI9JlfIgesBCXa2yzE3g48nSRHb79GdCOmxuRWqFWqPaBzv75Tus2',
    subtitle: 'Đang đọc "Dấu chân của Gió"',
    content: 'Chương 12 thật sự là một kiệt tác! Ai đã đọc xong chưa?',
    likes: 56,
    comments: 18,
  },
];

export const READING_LISTS: ReadingList[] = [
  {
    id: 'rl1',
    title: 'Cổ điển chọn lọc',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAgzoGeh7MC2hySBLUVlSlB1OTi-INIIyXK4YAPE6orAF0qSjyVfBsi8Wf6XX38zFNoXHDunoOXwGmpIK-XH1CJgl3BDnssILQ9nfBUwFnx1KDTRHY_E6SDbH2Tcq9eECpz-3g43p5MN7xFEZ9ZoiE1-R1dK_h7KaI8laLrNjQH9PPDJfBOizPEWlkEymT7G-MR-xEo3xQskDgThSvarT_fsXFQxbgz9woULH9FTMyA4jOkwrfSojAhFVXA83KhlRsf-Lj0qPtNz8M',
    bookCount: 12,
    saves: 450,
  },
  {
    id: 'rl2',
    title: 'Tư duy hiện đại',
    coverUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6CpLYLPm5L_l2VIaR06skBYqhjP22e5Jcuu8oNiR-Eph5ojzMmKetcFy1sjJno1-GTHbV4hl0JyNi4v3jK9TH9zwSkIaLl88yh4cJ8iI5ithd8S0Tq7tcWaC7ZfGw-mXEN4RmDg7B8jnwBk3VHLJwpypz6Oz-B6x_no5YX9rPQ_nsTXek6by52K4EIinORV90IvrUhc4t_uP_Lt0qmxypIAfUjzAoFzWd2QMHQspFjKDif2_CfquEqbYz1CiBP_GWY5Zv6BlzXU8X',
    bookCount: 8,
    saves: 120,
  },
];

export const WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: 't1', title: 'Mua "Dấu chân của Gió"', amount: -89000, date: '18/06/2026', type: 'debit' },
  { id: 't2', title: 'Nạp tiền ví', amount: 200000, date: '15/06/2026', type: 'credit' },
  { id: 't3', title: 'Tip tác giả Nguyễn Nhật Nam', amount: -50000, date: '10/06/2026', type: 'debit' },
  { id: 't4', title: 'Thưởng đọc liên tục 7 ngày', amount: 30000, date: '08/06/2026', type: 'credit' },
];

export const COLLECTION_CHIPS = ['Truyện cày đêm', 'Sách self-help', 'Văn học cổ điển', 'Kinh dị'];

export function getBookById(id: string): Book {
  const all = [FEATURED_BOOK, BOOK_DETAIL, ...TRENDING_BOOKS, ...RECOMMENDED_BOOKS, ...LIBRARY_BOOKS];
  return all.find((b) => b.id === id) ?? { ...BOOK_DETAIL, id };
}
