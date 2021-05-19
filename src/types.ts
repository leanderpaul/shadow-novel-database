export interface IModelUpdate {
  n: number;
  nModified: number;
}

export interface EditorContent {
  tag: 'p' | 'strong';
  text: string;
}
