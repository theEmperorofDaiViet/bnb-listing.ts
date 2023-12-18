import { reactive, readonly, DeepReadonly } from "vue";
import axios from "axios";

export interface Listing {
    id: string;
    title: string;
    description: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
}

interface State {
    listings: Listing[];
    loading: boolean;
}

export interface Store {
    state: DeepReadonly<State>,
    mutations: {
        updateListings: (payload: Listing[]) => void;
        loadingPending: () => void;
        loadingComplete: () => void;
    },
    actions: {
        getListings: () => Promise<void>;
        removeListing: (listing: Listing) => Promise<void>;
        resetListings: () => Promise<void>;
    },
}

const state = reactive<State>({
    listings: [],
    loading: false,
});

const mutations = {
    updateListings: (payload: Listing[]) => {
        state.listings = payload;
    },
    loadingPending: () => {
        state.loading = true
    },
    loadingComplete: () => {
        state.loading = false
    },
};

const actions = {
    getListings: () => {
        mutations.loadingPending();
        return axios.get<Listing[]>("/api/listings").then((res) => {
            mutations.updateListings(res.data);
            mutations.loadingComplete();
        });
    },
    removeListing: (listing: Listing) => {
        return axios.post<Listing[]>("api/listings/delete", listing).then((res) => {
            mutations.updateListings(res.data);
        })
    },
    resetListings: () => {
        return axios.post<Listing[]>("api/listings/reset").then((res) => {
            mutations.updateListings(res.data)
        });
    },
};

const store: Store =  {
    state: readonly(state),
    mutations,
    actions,
};

export default store;