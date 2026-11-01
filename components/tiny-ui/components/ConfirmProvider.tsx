/**
 * ConfirmProvider + useConfirm (어디서나 쓰는 확인 팝업)
 *
 * ConfirmModal을 앱 최상단(App.tsx)에 하나만 두고, 화면에서는 함수 호출로 띄움.
 * Alert.alert 대신 티니 디자인 팝업을 쓰고 싶을 때 사용.
 *
 *   const confirm = useConfirm();
 *
 *   // 취소 / 확인 두 버튼 — 확인을 누르면 true
 *   const ok = await confirm({
 *     title: '계정 탈퇴',
 *     message: '계정을 탈퇴하면 모든 데이터가 삭제되며,\n복구할 수 없습니다.',
 *     confirmLabel: '계정 탈퇴',
 *   });
 *   if (ok) { ... }
 *
 *   // 확인 버튼 하나 (안내용)
 *   await confirm({ title: '알림', message: '저장되었어요.', showCancel: false });
 */

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import ConfirmModal from './ConfirmModal';

export type ConfirmOptions = {
  title: string;
  message: string;
  /** 기본 "확인" */
  confirmLabel?: string;
  /** 기본 "취소" */
  cancelLabel?: string;
  /** false면 확인 버튼 하나만. 기본 true */
  showCancel?: boolean;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  const close = (ok: boolean) => {
    resolveRef.current?.(ok);
    resolveRef.current = null;
    setOptions(null);
  };

  const confirm = useCallback<ConfirmFn>((next) => {
    // 이미 떠 있는 팝업이 있으면 취소로 처리하고 새 팝업으로 교체
    resolveRef.current?.(false);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setOptions(next);
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmModal
        visible={options !== null}
        title={options?.title ?? ''}
        message={options?.message ?? ''}
        confirmLabel={options?.confirmLabel}
        cancelLabel={options?.cancelLabel}
        showCancel={options?.showCancel}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm은 ConfirmProvider 안에서만 쓸 수 있어요. (App.tsx 확인)');
  }
  return confirm;
}
