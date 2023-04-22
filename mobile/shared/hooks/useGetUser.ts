import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../providers/ApiProvider';

export const USER_QUERY_KEY = ['user'];

export const useGetUser = () => {
  const api = useContext(ApiContext);

  return useQuery({ queryKey: USER_QUERY_KEY, queryFn: () => api.getUser() });
};
