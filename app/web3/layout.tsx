import {TabGroup} from '#/ui/TabGroup';
import React from 'react';
import {Item, menus} from '#/lib/menu';

export default async function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <TabGroup
          path="/web3"
          items={[
            ...menus.find((menu: Item) => menu.slug === 'web3')?.items?.map((item: Item) => {
              return {text: item.name, slug: item.slug}
            }) || [],
          ]}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
