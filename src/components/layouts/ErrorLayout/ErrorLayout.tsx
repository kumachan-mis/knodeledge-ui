import AppContainer from '@/components/molecules/AppContainer';
import AppHeaderBase from '@/components/molecules/AppHeaderBase';
import AppMain from '@/components/molecules/AppMain';

export type ErrorLayoutComponentProps = {
  readonly children?: React.ReactNode;
};

const ErrorLayoutComponent: React.FC<ErrorLayoutComponentProps> = ({ children }) => (
  <AppContainer>
    <AppHeaderBase />
    <AppMain>{children}</AppMain>
  </AppContainer>
);

export default ErrorLayoutComponent;
