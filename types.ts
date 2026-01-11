
export interface Participant {
  id: string;
  name: string;
}

export interface GroupResult {
  groupName: string;
  members: Participant[];
}

export enum AppTab {
  Names = 'names',
  LuckyDraw = 'luckydraw',
  Grouping = 'grouping'
}
