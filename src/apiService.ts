export async function fetchData(url: string): Promise<any> {
  const response: Response = await fetch(url);
  const fetchedData: any = await response.json();
  return fetchedData;
}
