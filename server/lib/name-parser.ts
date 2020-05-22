import human from 'humanparser';

export function normalizeName(name: string) {
  const nameAttrs = human.parseName(name);

  return {
    firstName: nameAttrs.firstName || name.trim(),
    lastName: nameAttrs.lastName
  };
}
