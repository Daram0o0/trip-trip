'use client';
import Button from "@/commons/components/button";
import Input from "@/commons/components/input";
import Pagination from "@/commons/components/pagination";
import Searchbar from "@/commons/components/searchbar";
import Selectbox from "@/commons/components/selectbox";

export default function Home() {
  return (
    <div className="flex">
      <Searchbar />
      <Selectbox options={[{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }]} />
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
      <Button variant="primary" size="medium" theme="light">
        <span>Button</span>
      </Button>
      <Input variant="primary" size="medium" theme="light" />
    </div>
  );
}
