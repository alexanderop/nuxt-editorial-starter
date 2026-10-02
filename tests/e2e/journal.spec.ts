import { expect, test } from './test-utils'

const article = '/blog/building-for-the-long-way-round'
test('filter, search, clear, and reveal remaining posts', async ({ page }) => {
  await page.goto('/')
  const feed = page.locator('.home-feed')
  await expect(feed.getByRole('link')).toHaveCount(10)
  await feed.getByRole('button', { name: 'Design', exact: true }).click()
  await expect(feed.getByRole('link')).toHaveCount(4)
  await feed.getByRole('button', { name: 'Search posts' }).click()
  await feed.getByRole('searchbox', { name: 'Search posts' }).fill('space')
  await expect(feed.getByRole('link')).toHaveCount(1)
  await feed.getByRole('searchbox').fill('nothingmatchesxyz')
  await expect(feed.getByRole('status')).toHaveText(/No notes here yet/)
  await feed.getByRole('button', { name: 'Clear and close search' }).click()
  await feed.getByRole('button', { name: 'All', exact: true }).click()
  await feed.getByRole('button', { name: 'Load more' }).click()
  await expect(feed.getByRole('link')).toHaveCount(12)
  await expect(feed.getByRole('button', { name: 'Load more' })).toHaveCount(0)
})

test('Finder supports keyboard selection, sections, Escape, and focus restoration', async ({
  page,
}) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: '[/] Finder', exact: true })
  await trigger.click()
  const search = page.getByRole('combobox', { name: 'Search the journal' })
  await expect(search).toBeFocused()
  await search.fill('storage at the edge')
  await expect(page.getByRole('option')).toHaveCount(1)
  await search.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Control+k')
  await search.fill('storage at the edge')
  await expect(page.getByRole('option')).toHaveCount(1)
  await search.press('Enter')
  await expect(page).toHaveURL(/building-for-the-long-way-round#storage-at-the-edge$/)
  await expect(
    page.getByRole('heading', { name: 'Storage at the edge', exact: true }),
  ).toBeInViewport()
})

test('article rail follows headings and copy actions return real content', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto(article)
  const toc = page.getByRole('navigation', { name: 'Table of contents' })
  await toc.getByRole('link', { name: 'Keep the moving parts visible' }).click()
  await expect(toc.getByRole('link', { name: 'Storage at the edge' })).toBeVisible()
  await toc.getByRole('link', { name: 'Storage at the edge' }).click()
  await expect(toc.getByRole('link', { name: 'Storage at the edge' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(page.getByRole('progressbar', { name: 'Reading progress' })).not.toHaveAttribute(
    'aria-valuenow',
    '0',
  )
  await page.getByRole('button', { name: 'Copy ts code', exact: true }).first().click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('interface SavedPage')
  await page.getByRole('button', { name: '└ Copy markdown', exact: true }).click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('## Start with the useful thing')
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Building for the long way round', exact: true }),
  ).toBeVisible()
  await page.getByRole('region', { name: 'Keep exploring' }).getByRole('link').first().click()
  await expect(
    page.getByRole('heading', {
      name: 'A small case for local-first software',
      exact: true,
      level: 1,
    }),
  ).toBeVisible()
})

test('mobile menus, categories, long titles, code, and media tabs stay usable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Navigation menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  await page.getByRole('button', { name: 'Navigation menu' }).click()
  await page.getByRole('button', { name: 'More categories' }).click()
  await page.getByRole('menuitem', { name: 'Design' }).click()
  await page.getByRole('link', { name: /surprisingly useful test/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('surprisingly useful')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.goto(article)
  await page.getByRole('button', { name: 'Copy ts code' }).first().scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.getByRole('navigation', { name: 'Table of contents' })).toBeHidden()
  await page.goto('/blog/make-the-failure-useful')
  await page.getByRole('tab', { name: 'After', exact: true }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Your note is still on this device')
})

test('theme preference survives reload and motion preference is honored', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Color theme: system. Change theme' }).click()
  await page.getByRole('button', { name: 'Color theme: light. Change theme' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  expect(
    await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === 'running').length,
    ),
  ).toBe(0)
})

test('published routes, feeds, and search exclude the private draft', async ({ request }) => {
  const rss = await request.get('/rss.xml')
  expect(rss.status()).toBe(200)
  expect(await rss.text()).toContain('Building for the long way round')
  expect(await rss.text()).not.toContain('Unpublished workshop')
  const sitemap = await request.get('/sitemap.xml')
  expect(await sitemap.text()).not.toContain('_drafts')
  const search = await request.get('/api/search')
  expect(await search.text()).not.toContain('Unpublished workshop')
  const draft = await request.get('/blog/_drafts/unpublished-example')
  expect(draft.status()).toBe(404)
  const unknown = await request.get('/blog/does-not-exist')
  expect(unknown.status()).toBe(404)
  expect((await request.get('/api/markdown?path=/blog/_drafts/unpublished-example')).status()).toBe(
    404,
  )
})

test('workbench keyboard navigation and page transitions have no runtime errors', async ({
  page,
}) => {
  const failures: string[] = []
  page.on('pageerror', (error) => failures.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(message.text())
  })
  await page.goto('/')
  const tabs = page.getByRole('tablist', { name: 'Visual notes' })
  await tabs.getByRole('tab').first().focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.getByRole('tab').nth(1)).toBeFocused()
  await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('ROOM TO THINK')
  await page.getByRole('tabpanel').getByRole('link').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The space between things')
  await page.getByRole('link', { name: 'Fieldnotes home' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('fieldnotes.dev')
  expect(failures).toEqual([])
})

test('navigation shortcuts follow the header labels and do not interrupt typing', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /Color theme:/ })).toBeVisible()
  await page.keyboard.press('h')
  await expect(page).toHaveURL(/\/start$/)
  await expect(page.locator('#main')).toBeFocused()
  await page.keyboard.press('a')
  await expect(page).toHaveURL(/\/about$/)
  await page.keyboard.press('j')
  await expect(page).toHaveURL(/\/$/)
  await page.getByRole('button', { name: 'Search posts' }).click()
  await page.getByRole('searchbox').pressSequentially('jha')
  await expect(page.getByRole('searchbox')).toHaveValue('jha')
  await expect(page).toHaveURL(/\/$/)
  await page.getByRole('button', { name: 'Clear and close search' }).click()
  await page.keyboard.press('/')
  await page.getByRole('combobox', { name: 'Search the journal' }).pressSequentially('jha')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveURL(/\/$/)
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: 'Start reading', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Building for the long way round',
  )
  await page.keyboard.press('h')
  await expect(page).toHaveURL(/\/start$/)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Navigation menu' }).click()
  await page.keyboard.press('a')
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0)
})
