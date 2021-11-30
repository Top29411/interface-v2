import { createReducer, nanoid } from '@reduxjs/toolkit';
import {
  addPopup,
  PopupContent,
  removePopup,
  updateBlockNumber,
  ApplicationModal,
  setOpenModal,
  updateEthPrice,
  updateGlobalData,
  updateGlobalChartData,
  updateTopTokens,
  updateTokenPairs,
  updateSwapTokenPrice0,
  updateSwapTokenPrice1,
  addBookMarkToken,
  removeBookmarkToken,
  updateBookmarkTokens,
} from './actions';

type PopupList = Array<{
  key: string;
  show: boolean;
  content: PopupContent;
  removeAfterMs: number | null;
}>;

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number };
  readonly popupList: PopupList;
  readonly openModal: ApplicationModal | null;
  readonly ethPrice: any;
  readonly globalData: any;
  readonly globalChartData: any;
  readonly topTokens: any;
  readonly tokenPairs: any;
  readonly swapTokenPrice0: any;
  readonly swapTokenPrice1: any;
  readonly bookmarkedTokens: string[];
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  openModal: null,
  globalData: null,
  globalChartData: null,
  topTokens: null,
  tokenPairs: null,
  ethPrice: {
    price: null,
    oneDayPrice: null,
    ethPriceChange: null,
  },
  swapTokenPrice0: null,
  swapTokenPrice1: null,
  bookmarkedTokens: [],
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload;
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(
          blockNumber,
          state.blockNumber[chainId],
        );
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload;
    })
    .addCase(
      addPopup,
      (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
        state.popupList = (key
          ? state.popupList.filter((popup) => popup.key !== key)
          : state.popupList
        ).concat([
          {
            key: key || nanoid(),
            show: true,
            content,
            removeAfterMs,
          },
        ]);
      },
    )
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false;
        }
      });
    })
    .addCase(
      updateEthPrice,
      (state, { payload: { price, oneDayPrice, ethPriceChange } }) => {
        state.ethPrice = {
          price,
          oneDayPrice,
          ethPriceChange,
        };
      },
    )
    .addCase(updateGlobalData, (state, { payload: { data } }) => {
      state.globalData = data;
    })
    .addCase(updateGlobalChartData, (state, { payload }) => {
      state.globalChartData = payload;
    })
    .addCase(updateTopTokens, (state, { payload: { data } }) => {
      state.topTokens = data;
    })
    .addCase(updateTokenPairs, (state, { payload: { data } }) => {
      state.tokenPairs = data;
    })
    .addCase(updateSwapTokenPrice0, (state, { payload: { data } }) => {
      state.swapTokenPrice0 = data;
    })
    .addCase(updateSwapTokenPrice1, (state, { payload: { data } }) => {
      state.swapTokenPrice1 = data;
    })
    .addCase(addBookMarkToken, (state, { payload }) => {
      const tokens = state.bookmarkedTokens;
      tokens.push(payload);
      state.bookmarkedTokens = tokens;
    })
    .addCase(removeBookmarkToken, (state, { payload }) => {
      const tokenIndex = state.bookmarkedTokens.indexOf(payload);
      const tokens = state.bookmarkedTokens
        .slice(0, tokenIndex - 1)
        .concat(
          state.bookmarkedTokens.slice(
            tokenIndex + 1,
            state.bookmarkedTokens.length - 1,
          ),
        );
      state.bookmarkedTokens = tokens;
    })
    .addCase(updateBookmarkTokens, (state, { payload }) => {
      state.bookmarkedTokens = payload;
    }),
);
