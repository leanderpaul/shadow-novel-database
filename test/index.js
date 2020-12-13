const { userModel, novelModel, chapterModel } = require('../dist/index');

let user = null;
let novel = null;
let chapter = null;

async function runUser() {
  const user1 = await userModel.createUser({
    username: 'leanderpaul',
    password: 'leonelpaul'
  });
  console.log('New User ====> \n', user1);
  user = user1;

  const user2 = await userModel.findByUsername('leanderpaul', ['uid', 'username', 'library']);
  console.log('\n\nFind User ====> \n', user2);

  await userModel.updateUser('leanderpaul', { firstName: 'Leander' }, { nid: '123', operation: 'add' });
  console.log('\nChapter Updated ====>\n\n');
}

async function runNovel() {
  const novel1 = await novelModel.createNovel({
    author: 'leanderpaul',
    desc: 'The novel description',
    genre: 'SCI_FI',
    tags: ['ACTION'],
    status: 'ongoing',
    title: 'A Test Novel'
  });
  console.log('New Novel ====> \n', novel1);
  novel = novel1;

  const novel2 = await novelModel.findById(novel.nid, ['nid', 'title', 'cover', 'status', 'author']);
  console.log('\n\nFind Novel ====> \n', novel2);

  await novelModel.updateNovel(novel.nid, {}, true);
  console.log('\nChapter Updated ====>\n\n');
  runChapter();
}

async function runChapter() {
  const chapter1 = await chapterModel.createChapter({
    nid: novel.nid,
    vid: novel.volumes[0].vid,
    title: 'Test Chapter',
    content: 'Test Novel Chapter Content',
    matureContent: false
  });
  console.log('New Chapter ====> \n', chapter1);
  chapter = chapter1;

  const chapter2 = await chapterModel.findById(chapter.cid, ['nid', 'cid', 'title', 'index']);
  console.log('Find Chapter ====> \n\n', chapter2);
}

// runUser()
runNovel();
