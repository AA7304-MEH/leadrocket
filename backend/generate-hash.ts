import bcrypt from 'bcryptjs';

const run = async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password', salt);
    console.log('Hash:', hash);
};

run();
