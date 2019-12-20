export function apolloErrorLog(err: any) {
  if (err?.name !== 'Invariant Violation') {
    console.error(err);
  } else {
    console.log('cache no query');
  }
}
