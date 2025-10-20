/**
 * 클래스명을 병합하는 유틸리티 함수
 * 조건부 클래스명과 문자열을 결합하여 하나의 클래스명 문자열로 반환
 */
export function cn(
  ...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]
): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
