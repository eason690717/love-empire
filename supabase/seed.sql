-- Love Empire · seed catalog data (run once after migration)

insert into task_catalog (id, title, category, reward, attribute, coop) values
  ('t1', '丟衣服下去洗', 'chore', 10, 'care', false),
  ('t2', '摺被子整理床', 'chore', 10, 'care', false),
  ('t3', '幫忙整理 & 倒垃圾', 'chore', 30, 'care', false),
  ('t4', '幫忙拿去烘衣服', 'chore', 30, 'care', false),
  ('t5', '幫忙煮飯/買飯/飲料', 'chore', 50, 'care', false),
  ('t6', '載我上下班', 'chore', 200, 'care', false),
  ('t7', '說好話 / 情話一句', 'romance', 10, 'communication', false),
  ('t8', '主動擁抱一次', 'romance', 20, 'intimacy', false),
  ('t9', '心情不好馬上出現', 'romance', 200, 'intimacy', false),
  ('t10', '驚喜小禮物', 'surprise', 150, 'surprise', false),
  ('t11', '陪伴運動 30 分鐘', 'wellness', 60, 'care', false),
  ('t12', '一起睡前閱讀', 'wellness', 30, 'communication', false),
  ('t13', '一起看一部電影', 'coop', 80, 'intimacy', true),
  ('t14', '互相讚美 10 句', 'coop', 100, 'communication', true)
on conflict (id) do nothing;

insert into reward_catalog (id, title, cost, icon) values
  ('r1', '演唱會一場（含熱舞）', 100, '🎤'),
  ('r2', '代替洗碗券', 250, '🍽️'),
  ('r3', '長輩擋箭牌', 300, '🛡️'),
  ('r4', '現金回饋 50 元', 500, '💴'),
  ('r5', '現金回饋 100 元', 900, '💴'),
  ('r6', '高級貓咪照護', 1200, '🐱'),
  ('r7', '一日約會主導權', 800, '📅'),
  ('r8', '按摩 30 分鐘券', 400, '💆')
on conflict (id) do nothing;

insert into card_catalog (id, name, rarity, theme, emoji) values
  ('c1', '第一次牽手', 'SSR', 'romance', '🤝'),
  ('c2', '週末早午餐', 'N', 'daily', '🥐'),
  ('c3', '共撐一把傘', 'R', 'daily', '☂️'),
  ('c4', '深夜談心', 'SR', 'romance', '🌙'),
  ('c5', '一起煮飯', 'R', 'daily', '🍳'),
  ('c6', '情人節限定', 'SSR', 'festival', '💝'),
  ('c7', '京都旅行', 'SR', 'travel', '🏯'),
  ('c8', '生日蛋糕', 'SR', 'festival', '🎂'),
  ('c9', '第一場雪', 'R', 'travel', '❄️'),
  ('c10', '午後散步', 'N', 'daily', '🚶'),
  ('c11', '貓咪照護日', 'R', 'daily', '🐈'),
  ('c12', '神話級告白', 'SSR', 'romance', '💍')
on conflict (id) do nothing;

insert into item_catalog (id, label, emoji, price, season) values
  ('castle', '城堡', '🏰', 0, null),
  ('tree_sakura', '櫻花樹', '🌸', 50, 'spring'),
  ('tree_pine', '松樹', '🌲', 40, null),
  ('fountain', '愛心噴泉', '⛲', 200, null),
  ('bench', '長椅', '🪑', 30, null),
  ('cat', '城堡貓', '🐈', 120, null),
  ('flower', '花圃', '🌷', 20, null),
  ('castle_tower', '城堡塔', '🗼', 500, null),
  ('lantern', '燈籠', '🏮', 35, null)
on conflict (id) do nothing;
