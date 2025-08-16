import ErrorLayoutComponent from './ErrorLayout';

export type ErrorLayoutProps = {
  readonly children?: React.ReactNode;
};

const ErrorLayout: React.FC<ErrorLayoutProps> = (props) => {
  return <ErrorLayoutComponent {...props} />;
};

export default ErrorLayout;
