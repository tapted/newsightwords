interface User {
  displayName: string;
}

const onUser: Array<(_user: User) => unknown> = [];

export function addUserObserver(f: (_user: User) => unknown) {
  onUser.push(f);
}

export function loginWithGoogle() {
}

