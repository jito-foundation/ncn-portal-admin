# NCN Portal Admin

## Prerequisites

- [Volta](https://docs.volta.sh/guide/getting-started) installed (optional).
- Solna Wallet installed.


## Environment Variables

Copy `.env.example` file

```bash
cp .env.example .env
```

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXTAUTH_SECRET="iltvP3Uz6w2Fn4mM636oIEGGZ7G66o70Xuv11xmR5lk="
NEXT_PUBLIC_SOLANA_CHAIN=solana:devnet
```

## Installation

Here are the steps you need to follow to install the dependencies.

1. Install dependencies

```
yarn
```

2. Now run this command to start the developement server

```
yarn dev
```
