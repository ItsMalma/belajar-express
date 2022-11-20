# Belajar Express

Ini adalah repositori yang saya gunakan untuk tempat belajar NodeJS (Express).

## Semua Yang Digunakan

- [NodeJS](https://nodejs.org)
- [NPM](https://www.npmjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [Visual Studio Code](https://code.visualstudio.com/)
- [ExpressJS](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Express Validator](https://express-validator.github.io)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)

## Environment Variables

Untuk menjalankan projek ini, silahkan copy file `.env.example` menjadi `.env`, lalu isi variable yang sudah disediakan disana.

- `JWT_KEY` (required) ini adalah variabel yang akan digunakan sebagai private key dalam pembuatan / verifikasi token (JWT).
- `PORT` (optional) ini adalah variabel yang akan digunakan sebagai port dimana aplikasi dijalankan (default: 5000).

## Cara Menjalankan

Silahkan clone repositori ini dengan ketikkan perintah ini di terminal

```bash
  git clone https://github.com/ItsMalma/belajar-express.git
```

Lalu pergi ke direktori di mana file tersebut diclone

```bash
  cd belajar-express
```

Setelah masuk ke direktori, silahkan ketikkan perintah berikut untuk menginstall dependensi yang nanti akan digunakan saat aplikasi dijalankan

```bash
  npm install
```

Setelah semua dependensi berhasil diinstall, maka langkah selanjutnya pastikan anda mengaktifkan server PostgreSQL kalian, dan cocokkan database yang nanti akan kalian gunakan dengan mengedit file `config/config.json` yang sudah disediakan.

```json
{
  "development": {
    "dialect": "postgres",
    "username": "malma",
    "password": "password",
    "host": "127.0.0.1",
    "port": 5432,
    "database": "belajar_express"
  }
}
```

Setelah database selesai, maka selanjutnya kalian hanya perlu mengetikkan perintah berikut untuk menjalankan server.

```bash
  npm run start
```

## Authors

- [@ItsMalma](https://www.github.com/ItsMalma)

## License

[MIT](https://choosealicense.com/licenses/mit/)
