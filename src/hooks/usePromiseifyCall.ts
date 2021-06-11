import { useState, useMemo } from 'react';

type PromiseifyCallResult = {
  loading: Boolean
  error: any;
  result: any;
  valid: Boolean;
}

export default function usePromiseifyCall(contact, methodName, args: any): PromiseifyCallResult {
  const [ callState, updateCallState ] = useState<PromiseifyCallResult>({
    loading: true,
    error: null,
    result: null,
    valid: false
  });

  if (!contact[methodName]) {
    return {
      loading: true,
      error: null,
      result: null,
      valid: false
    };
  }


  contact[methodName](...args).then((result) => {
    updateCallState((state) => {
      return {
        loading: false,
        valid: true,
        error: null,
        result: [result]
      };
    });
  }).catch((error) => {
    updateCallState((state) => {
      return {
        loading: false,
        valid: true,
        result: null,
        error
      };
    });
  });

  return useMemo(() => {
    return callState;
  }, [callState]);
}