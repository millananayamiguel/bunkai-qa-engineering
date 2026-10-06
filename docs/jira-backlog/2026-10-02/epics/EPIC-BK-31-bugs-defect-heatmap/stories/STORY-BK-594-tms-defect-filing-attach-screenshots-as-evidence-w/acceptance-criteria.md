# BK-594 — Acceptance Criteria

> Jira field: `customfield_10110` · [View in Jira](https://jira.upexgalaxy.com/browse/BK-594)

## AC-01 — File a defect with an uploaded screenshot

```
Scenario: A screenshot attached while filing lands on the defect
  Given I am executing a Run and I have marked step 4 as failed
  And I have opened the Report-bug drawer from step 4
  When I attach an image file from my machine and file the defect
  Then the defect is created
  And its evidence holds that image
  And I can open the image from the defect record
```

---

## AC-02 — Uploaded images and pasted links share one budget of ten

```
Scenario: Both kinds of evidence count against the same limit
  Given I am filing a defect and I have pasted six evidence links
  When I attach four images from my machine
  Then the defect reads as holding ten evidence items of the ten allowed
  And no further evidence of either kind can be added
```

---

## AC-03 — The eleventh evidence item is refused and the ten survive

```
Scenario: Adding an eleventh item leaves the existing ten untouched
  Given I am filing a defect that already holds ten evidence items
  When I try to add an eleventh, whether by attaching an image or by pasting a link
  Then Bunkai refuses it and tells me the defect is already at its limit of ten
  And the ten items already there are all still present, in the order I added them
  And none of them has been replaced or dropped
```

---

## AC-04 — A file that is not an image is refused

```
Scenario: A non-image file is rejected without touching the evidence gathered so far
  Given I am filing a defect that already holds two evidence items
  When I try to attach a file that is not an image
  Then Bunkai refuses the file and tells me which kinds of file are accepted
  And the defect still holds exactly the two evidence items it had
```

---

## AC-05 — A file above the size limit is refused

```
Scenario: An oversized image is rejected and the limit is named
  Given I am filing a defect
  When I try to attach an image larger than the accepted size
  Then Bunkai refuses the file and tells me the size limit
  And nothing is stored
```

---

## AC-06 — Evidence is readable only inside the Workspace that owns the defect

```
Scenario: A member of another Workspace cannot read an image attached to my defect
  Given a defect owned by Workspace A holds an uploaded image as evidence
  And I am a member of Workspace B and of no other Workspace
  When I attempt to open that image using a direct reference to it
  Then the image is not shown to me
  And I am given no part of its content
```

---

## AC-07 — A filing whose upload fails leaves nothing half-created

```
Scenario: A failed upload does not produce a defect pointing at nothing
  Given I am filing a defect with a title, a description, and two images attached
  When one image fails to upload and I submit the filing
  Then I am told the filing did not succeed and why
  And no defect has been created
  And my title, my description, and the evidence that did upload are all still in the drawer for me to retry with
```

---

## AC-08 — The pasted evidence link keeps working unchanged

```
Scenario: Filing with pasted links only behaves exactly as before
  Given I am filing a defect from a failing step
  When I paste evidence links and attach no files at all
  Then the defect is created with those links as its evidence
  And each link renders and opens exactly as it does today
```

---

## AC-09 — The defect record counts both kinds together

```
Scenario: The evidence count on the record covers uploads and links alike
  Given a defect was filed with two uploaded images and one pasted link
  When I open that defect record
  Then its evidence reads as 3 of 10
  And all three rows are listed
  And every row opens, image and link alike
```

---

## AC-10 — A defect filed with no evidence is valid

```
Scenario: Evidence is optional and its absence is stated, not treated as an error
  Given I file a defect without attaching or pasting any evidence
  Then the defect is created
  And its record reads as 0 of 10 with an empty evidence list
  And no error, broken row, or missing-image placeholder is shown
```

---

## AC-11 — A filed defect's evidence cannot be changed

```
Scenario: Evidence is fixed once the defect is filed
  Given a defect was filed with two uploaded images
  When I open that defect record
  Then no way to add, replace, or remove evidence is offered to me
  And both images are still listed and still open
```

---

## AC-12 — Evidence attachment works on a defect filed without a Run

```
Scenario: A standalone defect can carry uploaded evidence too
  Given I am filing a defect that is not linked to any Run or failing step
  When I attach an image from my machine and file it
  Then the defect is created with that image as its evidence
  And it is subject to the same limit of ten evidence items
```

---
_Synced from Jira by sync-jira-issues_
