import { AppWebHadifCliPage } from './app.po';

describe('app-web-hadif-cli App', () => {
  let page: AppWebHadifCliPage;

  beforeEach(() => {
    page = new AppWebHadifCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
