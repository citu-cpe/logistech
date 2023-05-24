import { Landing } from '../modules/index/components/Landing';
import { Home } from '../modules/index/components/Home/Home';
import { AppPropsWithLayout, NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import { Layout } from '../shared/components/ui/Layout';
import { CenterLayout } from '../shared/components/ui/CenterLayout';
import { useAuthStore } from '../shared/stores';

const Index: NextPageWithLayout = ({ isAuth }: AppPropsWithLayout) => {
  const { userRole, companyType } = useAuthStore();

  return isAuth && (!!companyType || userRole) ? (
    <Home companyType={companyType} userRole={userRole} />
  ) : (
    <Landing />
  );
};

Index.getLayout = (page: ReactElement<AppPropsWithLayout>) => {
  return page.props.isAuth ? Layout(page) : CenterLayout(page);
};

export default Index;
