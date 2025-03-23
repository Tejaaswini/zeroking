# ♟️ ZeroKing

**ZeroKing** is a trustless, tamper-proof, privacy-preserving chess game powered by zero-knowledge cryptography.

Built with:
- ✅ SvelteKit (Frontend)
- ✅ o1js & zkAppWorker (ZK Game Logic on Mina)
- ✅ zkEmail (for .edu identity verification)
- ✅ French Toast (for clean notifications)

---

## 🚀 Features

- 🎓 **.edu-only login** via ZK email proof
- 🔐 Zero-Knowledge proof-verified chess engine
- ♟️ On-chain move validation with full game history
- 🏆 Resign or Draw triggers a visual game over screen
- 🖼️ (Coming soon) NFT minting for victories and draws
- 🔁 Automatic redirect to home after game ends

---

## 🧱 Project Structure

```
src/
├── routes/
│   ├── +page.svelte        # Landing Page with ZK Email Login
│   └── game/+page.svelte   # Core Chess UI
├── lib/
│   ├── zkapp/              # zkApp client for Mina logic
│   ├── components/         # Reusable Svelte components
│   └── utils/              # Minting, proof handling (WIP)
```

---

## 🧪 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

You’ll need:
- Node 18+
- `nargo` if building Noir circuits locally (for zkEmail proof generation)
- A Mina wallet (Auro) to interact with the zkApp

---

## 🧠 How It Works

1. User enters `.edu` email
2. Generates a zkEmail proof (mocked for now)
3. Connects wallet and enters game
4. All moves are verified in a zk circuit (via o1js)
5. On draw or resign:
   - Outcome modal appears
   - Auto-redirects to home
   - (Soon) Mints NFT to reward the player(s)

---

## 📸 Game Over Modal

| Resign                            | Draw                              |
|----------------------------------|-----------------------------------|
| ![resign](https://i.imgur.com/fXzT4eo.jpg) | ![draw](https://i.imgur.com/TrAArbn.jpg) |

---

## 🛣️ Roadmap

- [x] .edu-only entry via zkEmail
- [x] Game logic via zkApp client
- [x] Game-over modal + redirect
- [ ] NFT mint on game end
- [ ] ZK Proof verification inside `o1js` circuit
- [ ] Tournament mode with sponsor badges

---

## 🤝 

ZeroKing is built with tools and inspiration from:
- [zkEmail](https://github.com/zkemail/zkemail)
- [Mina Protocol](https://minaprotocol.com)
- [Svelte](https://svelte.dev)
- [ETHGlobal Trifecta](https://ethglobal.com/events/trifecta)
